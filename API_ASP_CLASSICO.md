# API ASP Clássico — Costa Soares Advogados

Documentação para implementação do back-end em **ASP Clássico (VBScript / IIS)** que alimentará o site `costasoares.adv.br`. Todos os textos exibidos no site (hero, sobre, advogados, blog) são consumidos via estas APIs. O front-end espera respostas em **JSON** com `Content-Type: application/json; charset=utf-8`.

---

## 1. Visão Geral

| Recurso              | Método | Endpoint                                  | Descrição                                   |
| -------------------- | ------ | ----------------------------------------- | ------------------------------------------- |
| Conteúdo do site     | GET    | `https://costasoares.adv.br/api/content.asp` | Hero, Sobre e dados dos advogados.          |
| Posts do blog        | GET    | `https://costasoares.adv.br/api/posts.asp`   | Lista de artigos / publicações.             |
| Envio de contato     | POST   | `https://costasoares.adv.br/api/contact.asp` | Recebe formulário e envia e-mail / persiste.|

> O front-end já possui valores de **fallback** caso as APIs estejam indisponíveis. Mesmo assim, em produção, todas devem responder corretamente.

---

## 2. Ambiente e Requisitos do Servidor

- **Windows Server** com **IIS 7+** e suporte habilitado a **ASP Clássico**.
- Componentes:
  - `Scripting.FileSystemObject`
  - `ADODB.Connection` / `ADODB.Recordset` (caso use banco)
  - `CDO.Message` (envio de e-mail SMTP)
  - `MSXML2.ServerXMLHTTP` (caso consuma serviços externos)
  - Biblioteca JSON para ASP Clássico recomendada: **aspJSON** (https://github.com/withinboredom/aspjson) ou **JSON_2.0.4.asp**.
- Codificação dos arquivos `.asp`: **UTF-8 sem BOM**.
- Primeira linha de cada arquivo:
  ```asp
  <%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %>
  <% Response.CodePage = 65001
     Response.CharSet  = "utf-8"
     Response.ContentType = "application/json" %>
  ```

### Banco de dados sugerido (SQL Server / Access)

```sql
CREATE TABLE site_content (
  chave    NVARCHAR(50)  PRIMARY KEY, -- ex.: 'heroTitle', 'logoUrl'
  valor    NVARCHAR(MAX) NOT NULL
);

CREATE TABLE lawyers (
  id        INT IDENTITY PRIMARY KEY,
  nome      NVARCHAR(120) NOT NULL,
  titulo    NVARCHAR(120) NOT NULL,
  oab       NVARCHAR(50),
  bio       NVARCHAR(MAX),
  foto_url  NVARCHAR(300),
  ordem     INT DEFAULT 0
);

CREATE TABLE posts (
  id         INT IDENTITY PRIMARY KEY,
  titulo     NVARCHAR(200) NOT NULL,
  resumo     NVARCHAR(500),
  conteudo   NVARCHAR(MAX),
  data_pub   DATETIME NOT NULL,
  imagem_url NVARCHAR(300),
  url        NVARCHAR(300),
  publicado  BIT DEFAULT 1
);

CREATE TABLE contatos (
  id         INT IDENTITY PRIMARY KEY,
  nome       NVARCHAR(120),
  email      NVARCHAR(150),
  telefone   NVARCHAR(30),
  mensagem   NVARCHAR(MAX),
  criado_em  DATETIME DEFAULT GETDATE(),
  ip         NVARCHAR(45)
);
```

---

## 3. CORS (obrigatório)

Como o site é servido por `https://costasoares.adv.br` e as APIs também, idealmente não há CORS. Caso fique em subdomínio (ex.: `api.costasoares.adv.br`), inclua no topo de cada `.asp`:

```asp
Response.AddHeader "Access-Control-Allow-Origin", "https://costasoares.adv.br"
Response.AddHeader "Access-Control-Allow-Methods", "GET, POST, OPTIONS"
Response.AddHeader "Access-Control-Allow-Headers", "Content-Type"

If UCase(Request.ServerVariables("REQUEST_METHOD")) = "OPTIONS" Then
  Response.Status = "204 No Content"
  Response.End
End If
```

---

## 4. `GET /api/content.asp`

### Resposta esperada (200 OK)

```json
{
  "logoUrl": "https://costasoares.adv.br/uploads/logo.png",
  "heroTitle": "Costa Soares Advogados",
  "heroSubtitle": "Excelência em Direito Cível, Consumidor, Sucessório e Assessoria Empresarial.",
  "aboutTitle": "Tradição, ética e resultado",
  "aboutText": "O escritório Costa Soares Advogados atua de forma personalizada...",
  "lawyers": [
    {
      "id": 1,
      "name": "Dr. Costa",
      "title": "Sócio Fundador",
      "oab": "OAB/SP 000.000",
      "bio": "Especialista em Direito Cível e Sucessório...",
      "photoUrl": "https://costasoares.adv.br/uploads/dr-costa.jpg"
    },
    {
      "id": 2,
      "name": "Dra. Soares",
      "title": "Sócia Fundadora",
      "oab": "OAB/SP 000.000",
      "bio": "Especialista em Direito do Consumidor...",
      "photoUrl": "https://costasoares.adv.br/uploads/dra-soares.jpg"
    }
  ]
}
```

### Regras
- `logoUrl` é **opcional**. Quando preenchido, o site exibe a imagem no cabeçalho e rodapé; quando vazio ou ausente, exibe o texto "Costa Soares Advogados".
- Os campos `heroTitle`, `heroSubtitle`, `aboutTitle`, `aboutText` são **obrigatórios**.
- `lawyers` deve conter **exatamente 2 itens** (estrutura visual do site).
- `photoUrl` deve apontar para imagem **HTTPS**, idealmente 800×1000 px (proporção 4:5).
- Nomes de campos em **camelCase** exatamente como acima.

### Exemplo (esqueleto VBScript)

```asp
<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %>
<!--#include file="JSON_2.0.4.asp"-->
<% 
Response.CodePage = 65001
Response.CharSet  = "utf-8"
Response.ContentType = "application/json"

Dim conn, rs, json
Set conn = Server.CreateObject("ADODB.Connection")
conn.Open "Provider=SQLOLEDB;Data Source=...;Initial Catalog=costasoares;User Id=...;Password=...;"

Set json = jsObject()

' Conteúdo chave/valor
Set rs = conn.Execute("SELECT chave, valor FROM site_content")
Do While Not rs.EOF
  json(rs("chave").Value) = rs("valor").Value & ""
  rs.MoveNext
Loop
rs.Close

' Advogados
Dim arr : Set arr = jsArray()
Set rs = conn.Execute("SELECT TOP 2 id, nome, titulo, oab, bio, foto_url FROM lawyers ORDER BY ordem")
Do While Not rs.EOF
  Dim item : Set item = jsObject()
  item("id")       = CLng(rs("id"))
  item("name")     = rs("nome") & ""
  item("title")    = rs("titulo") & ""
  item("oab")      = rs("oab") & ""
  item("bio")      = rs("bio") & ""
  item("photoUrl") = rs("foto_url") & ""
  arr.Push item
  rs.MoveNext
Loop
json("lawyers") = arr

Response.Write json.Serialize()
conn.Close
%>
```

---

## 5. `GET /api/posts.asp`

### Resposta esperada (200 OK)

```json
[
  {
    "id": 1,
    "title": "Novas regras do Código de Defesa do Consumidor",
    "excerpt": "Entenda as recentes mudanças...",
    "date": "2026-04-12",
    "imageUrl": "https://costasoares.adv.br/uploads/post-1.jpg",
    "url": "https://costasoares.adv.br/blog/novas-regras-cdc"
  }
]
```

### Regras
- `date` em formato **ISO `YYYY-MM-DD`** (o front-end usa `new Date(...)`).
- Retornar **somente posts com `publicado = 1`**, ordenados por `data_pub DESC`.
- Limite recomendado: 6 posts.
- `imageUrl` e `url` são opcionais.

---

## 6. `POST /api/contact.asp`

### Request (JSON)

```json
{
  "name": "Fulano de Tal",
  "email": "fulano@exemplo.com",
  "phone": "(11) 99999-9999",
  "message": "Gostaria de agendar uma consulta..."
}
```

### Resposta

- **200 OK** → `{ "ok": true }`
- **400 Bad Request** → `{ "ok": false, "error": "Campos obrigatórios ausentes" }`
- **500 Internal Server Error** → `{ "ok": false, "error": "Falha interna" }`

O front-end só verifica `res.ok` (status HTTP 2xx), mas é boa prática retornar JSON.

### Ações esperadas

1. Validar campos obrigatórios (`name`, `email`, `message`).
2. Sanitizar entradas (remover HTML, limitar tamanho).
3. Persistir em `contatos`.
4. Enviar e-mail para `contato@costasoares.adv.br` via **CDO.Message**.
5. (Opcional) anti-spam: honeypot, rate limit por IP, reCAPTCHA.

### Exemplo (esqueleto)

```asp
<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %>
<!--#include file="JSON_2.0.4.asp"-->
<%
Response.CodePage = 65001
Response.ContentType = "application/json"

If UCase(Request.ServerVariables("REQUEST_METHOD")) <> "POST" Then
  Response.Status = "405 Method Not Allowed"
  Response.Write "{""ok"":false,""error"":""Método não permitido""}"
  Response.End
End If

Dim raw, data
raw = ""
Dim bytes : bytes = Request.TotalBytes
If bytes > 0 Then
  Dim bin : bin = Request.BinaryRead(bytes)
  Dim i
  For i = 1 To LenB(bin)
    raw = raw & Chr(AscB(MidB(bin, i, 1)))
  Next
End If

Set data = JSON.parse(raw)

Dim nome, email, fone, msg
nome  = Trim(data.name & "")
email = Trim(data.email & "")
fone  = Trim(data.phone & "")
msg   = Trim(data.message & "")

If nome = "" Or email = "" Or msg = "" Then
  Response.Status = "400 Bad Request"
  Response.Write "{""ok"":false,""error"":""Campos obrigatórios ausentes""}"
  Response.End
End If

' Persistir
Dim conn : Set conn = Server.CreateObject("ADODB.Connection")
conn.Open "Provider=SQLOLEDB;..."
Dim cmd : Set cmd = Server.CreateObject("ADODB.Command")
cmd.ActiveConnection = conn
cmd.CommandText = "INSERT INTO contatos (nome,email,telefone,mensagem,ip) VALUES (?,?,?,?,?)"
cmd.Parameters.Append cmd.CreateParameter("p1", 200, 1, 120, nome)
cmd.Parameters.Append cmd.CreateParameter("p2", 200, 1, 150, email)
cmd.Parameters.Append cmd.CreateParameter("p3", 200, 1, 30,  fone)
cmd.Parameters.Append cmd.CreateParameter("p4", 201, 1, 4000, msg)
cmd.Parameters.Append cmd.CreateParameter("p5", 200, 1, 45,  Request.ServerVariables("REMOTE_ADDR"))
cmd.Execute

' Enviar e-mail
Dim mail : Set mail = Server.CreateObject("CDO.Message")
mail.Configuration.Fields("http://schemas.microsoft.com/cdo/configuration/sendusing")     = 2
mail.Configuration.Fields("http://schemas.microsoft.com/cdo/configuration/smtpserver")    = "smtp.seuprovedor.com.br"
mail.Configuration.Fields("http://schemas.microsoft.com/cdo/configuration/smtpserverport")= 587
mail.Configuration.Fields("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate")=1
mail.Configuration.Fields("http://schemas.microsoft.com/cdo/configuration/sendusername") = "contato@costasoares.adv.br"
mail.Configuration.Fields("http://schemas.microsoft.com/cdo/configuration/sendpassword") = "********"
mail.Configuration.Fields.Update
mail.From    = "contato@costasoares.adv.br"
mail.To      = "contato@costasoares.adv.br"
mail.ReplyTo = email
mail.Subject = "Novo contato pelo site - " & nome
mail.TextBody = "Nome: " & nome & vbCrLf & _
                "E-mail: " & email & vbCrLf & _
                "Telefone: " & fone & vbCrLf & vbCrLf & msg
mail.Send

Response.Write "{""ok"":true}"
%>
```

---

## 7. Segurança

- Sempre usar **parâmetros** em queries (jamais concatenar SQL com input).
- Limitar tamanho de cada campo (`name` 100, `email` 150, `phone` 20, `message` 2000).
- Habilitar **HTTPS** com certificado válido (TLS 1.2+).
- Configurar **rate limiting** no IIS (Dynamic IP Restrictions) para `contact.asp`.
- Não retornar mensagens de erro detalhadas ao cliente — logar internamente.
- Headers recomendados:
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=31536000`

---

## 8. Hospedagem das Imagens

- Fotos dos advogados e imagens de posts devem ficar em pasta pública, ex.: `/uploads/`.
- Servir via mesmo domínio para evitar problemas de CORS/mixed content.
- Tamanhos sugeridos:
  - **Advogados**: 800×1000 px (4:5), JPG otimizado < 200 KB.
  - **Posts**: 1200×675 px (16:9), JPG < 250 KB.
  - **Logo**: já embarcado no front-end.

---

## 9. DNS e Domínio (`costasoares.adv.br`)

| Tipo  | Nome | Valor                              | Observação                       |
| ----- | ---- | ---------------------------------- | -------------------------------- |
| A     | @    | IP do servidor IIS                 | Site institucional               |
| CNAME | www  | costasoares.adv.br                 | Redirecionar para raiz           |
| MX    | @    | servidor de e-mail                 | Receber `contato@…`              |
| TXT   | @    | `v=spf1 include:_spf.provedor ~all`| SPF para evitar spam             |
| TXT   | _dmarc | `v=DMARC1; p=quarantine; rua=...`| DMARC                             |

---

## 10. Checklist de Go-Live

- [ ] IIS configurado com ASP Clássico habilitado.
- [ ] Certificado SSL instalado (Let's Encrypt ou outro).
- [ ] Banco criado e populado com conteúdo inicial (`site_content`, `lawyers`, `posts`).
- [ ] Endpoints retornando JSON válido (testar com `curl` ou Postman).
- [ ] CORS configurado se API estiver em subdomínio.
- [ ] SMTP autenticado funcionando (teste real do formulário).
- [ ] Backup automático do banco.
- [ ] Monitoramento de uptime das três rotas.
- [ ] Atualizar `API_BASE_URL` em `src/lib/api.ts` se o caminho final for diferente.

---

## 11. Contatos do Projeto

- **Domínio:** costasoares.adv.br
- **E-mail:** contato@costasoares.adv.br
- **Telefone / WhatsApp:** (11) 9-7246-6811

---

## 7. Painel Administrativo (`/admin`)

O front-end inclui um painel em `costasoares.adv.br/admin` com login, gestão de conteúdo, advogados, blog (com editor rico e upload de imagens). Todas as rotas exigem `Authorization: Bearer <token>`.

### 7.1 Banco MySQL — tabelas adicionais

```sql
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,  -- bcrypt/sha256+salt
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_sessions (
  token CHAR(64) PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  excerpt VARCHAR(300),
  content MEDIUMTEXT,        -- HTML do editor rico
  image_url VARCHAR(500),
  url VARCHAR(500),
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

> Cadastro inicial: insira um usuário admin manualmente com hash forte (bcrypt). Nunca armazene senha em texto plano.

### 7.2 Endpoints administrativos

| Método | Endpoint                          | Descrição                                  |
| ------ | --------------------------------- | ------------------------------------------ |
| POST   | `/api/admin/login.asp`            | `{username, password}` → `{token}`         |
| POST   | `/api/admin/logout.asp`           | Invalida token atual                       |
| GET    | `/api/admin/content.asp`          | Retorna `SiteContent` completo             |
| POST   | `/api/admin/content.asp`          | Atualiza textos do site                    |
| POST   | `/api/admin/lawyers.asp`          | Cria/atualiza advogado (id opcional)       |
| DELETE | `/api/admin/lawyers.asp?id=N`     | Remove advogado                            |
| GET    | `/api/admin/posts.asp`            | Lista artigos                              |
| GET    | `/api/admin/posts.asp?id=N`       | Detalhe (inclui `content` HTML)            |
| POST   | `/api/admin/posts.asp`            | Cria/atualiza artigo (id opcional)         |
| DELETE | `/api/admin/posts.asp?id=N`       | Remove artigo                              |
| POST   | `/api/admin/upload.asp`           | `multipart/form-data` (campo `file`) → `{url}` |

### 7.3 Segurança recomendada

- Hash de senha com bcrypt (ex.: componente `ASPHash`) ou PBKDF2/SHA-256 + salt.
- Token aleatório de 32 bytes (hex) gerado no login, salvo em `admin_sessions` com validade (ex.: 8h).
- Validar `Authorization: Bearer <token>` em todas as rotas `/admin/*`.
- HTTPS obrigatório.
- Rate limit no `login.asp` (ex.: 5 tentativas/min por IP).
- Sanitizar HTML recebido em `content` dos posts antes de exibir publicamente (whitelist de tags).
- Upload: validar tipo MIME (`image/*`), tamanho máximo (ex.: 5 MB), salvar em `/arquivos/uploads/` com nome aleatório.

### 7.4 Exemplos

**Login**
```http
POST /api/admin/login.asp
Content-Type: application/json

{ "username": "admin", "password": "***" }

200 OK
{ "token": "a1b2c3...", "expiresAt": "2026-05-22T03:00:00Z" }
```

**Salvar post**
```http
POST /api/admin/posts.asp
Authorization: Bearer a1b2c3...
Content-Type: application/json

{
  "id": 12,
  "title": "Novo artigo",
  "excerpt": "Resumo curto",
  "content": "<p>Conteúdo HTML</p>",
  "date": "2026-05-21",
  "imageUrl": "/arquivos/uploads/abc.jpg"
}
```

**Upload**
```http
POST /api/admin/upload.asp
Authorization: Bearer a1b2c3...
Content-Type: multipart/form-data; boundary=...

200 OK
{ "url": "/arquivos/uploads/9f3a.jpg" }
```
