# Guia de Prevenção contra SQL Injection

## ⚠️ Vulnerabilidades Críticas Identificadas

### 1️⃣ CRÍTICO: `/action/dbu.php` - Execução Arbitrária de SQL
```php
// ❌ VULNERÁVEL
$dbsql = $_POST["txtSQL"];  // Entrada do usuário diretamente
$result = $conn->query($dbsql);  // Executada sem validação
```
**Risco**: Um atacante pode executar qualquer comando SQL (DROP, DELETE, UPDATE de todas as linhas, etc.)

---

### 2️⃣ ALTO: `/action/login.php` - SQL Injection no Login
```php
// ❌ VULNERÁVEL
$sql = "SELECT * FROM users where USEREMAIL='" . $useremail. "'";
// Entrada: ' OR '1'='1
// Resultado: SELECT * FROM users where USEREMAIL='' OR '1'='1'
// Consequência: Retorna TODOS os usuários (bypass de autenticação)
```

---

### 3️⃣ ALTO: `/action/createuser.php` - SQL Injection na Verificação de Nickname
```php
// ❌ VULNERÁVEL
$sql = "SELECT * FROM users where USERNICKNAME='" . $usernickname. "'";
// Entrada: '; DROP TABLE users; --
// Resultado: DELETE ou UPDATE não autorizado possível
```

---

## ✅ Solução 1: Prepared Statements (RECOMENDADO - Mais Seguro)

### Conceito
Separa a estrutura SQL dos dados, tornando impossível que dados injetem código SQL.

### Implementação em `login.php`

**ANTES (Vulnerável):**
```php
$sql = "SELECT * FROM users where USEREMAIL='" . $useremail. "'";
$result = $conn->query($sql);
```

**DEPOIS (Seguro):**
```php
// Usar prepared statement
$sql = "SELECT * FROM users WHERE USEREMAIL = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    die("Erro ao preparar statement: " . htmlspecialchars($conn->error));
}

// Bind parameters: "s" = string
$stmt->bind_param("s", $useremail);
$stmt->execute();

$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $row = $result->fetch_array(MYSQLI_ASSOC);
    
    if ($userpwd == $row["USERPASSWORD"]) {
        $_SESSION["userlogged"] = $row["USERNICKNAME"];
        $_SESSION["userid"] = $row["USERID"];
        header("location: ../home.php");
    } else {
        $_SESSION["error"] = "Username/password incorrect";
        header("location: ../index.php");
    }
}

$stmt->close();  // Importante!
```

---

### Implementação em `createuser.php`

**ANTES (Vulnerável):**
```php
$sql = "SELECT * FROM users where USERNICKNAME='" . $usernickname. "'";
$result = $conn->query($sql);
```

**DEPOIS (Seguro):**
```php
$sql = "SELECT * FROM users WHERE USERNICKNAME = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    die("Erro ao preparar statement: " . htmlspecialchars($conn->error));
}

$stmt->bind_param("s", $usernickname);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $_SESSION["error"] = "Nickname já está em uso por outro participante :(";
    $conn->close();
    header("location: ../newuser.php");
    exit();
}

$stmt->close();
```

---

### Guia de Tipos de Parâmetros `bind_param`
```php
"s"  // string (email, nickname, texto)
"i"  // integer (ID do usuário, pontos)
"d"  // double/float (valores decimais)
"b"  // blob (arquivos binários)
```

**Exemplo com Múltiplos Parâmetros:**
```php
$sql = "INSERT INTO users (USERNAME, USEREMAIL, USERID) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $username, $useremail, $userid);
//                 ^^^
//                 string, string, integer
$stmt->execute();
```

---

## ✅ Solução 2: Função Auxiliar (DRY - Don't Repeat Yourself)

Para evitar repetir código de prepared statements, crie uma função reutilizável:

**Arquivo: `/action/db-helper.php` (NOVO)**
```php
<?php

/**
 * Executa uma query segura com prepared statements
 * 
 * @param mysqli $conn Conexão com BD
 * @param string $sql SQL query com placeholders (?)
 * @param string $types Tipos dos parâmetros (s=string, i=int, d=double)
 * @param array $params Array com os valores dos parâmetros
 * @return mysqli_result|false
 */
function executeSafeQuery($conn, $sql, $types, $params) {
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        die("Erro ao preparar statement: " . htmlspecialchars($conn->error));
    }
    
    // Bind parameters dinamicamente
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    if (!$stmt->execute()) {
        die("Erro ao executar: " . htmlspecialchars($stmt->error));
    }
    
    return $stmt->get_result();
}

/**
 * Simplified version - SELECT queries
 */
function selectSafeQuery($conn, $sql, $types = "", $params = []) {
    return executeSafeQuery($conn, $sql, $types, $params);
}

/**
 * Executa INSERT/UPDATE/DELETE e retorna linhas afetadas
 */
function executeModifyQuery($conn, $sql, $types, $params) {
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        return false;
    }
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    if (!$stmt->execute()) {
        return false;
    }
    
    $affected = $stmt->affected_rows;
    $stmt->close();
    return $affected;
}

?>
```

**Uso na `login.php`:**
```php
<?php
session_start();

require_once("db-helper.php");

$dbservername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "cup2018";

$useremail = $_POST["txtEmail"];
$userpwd = $_POST["txtPwd"];

$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if ($conn->connect_error) {
    $_SESSION["error"] = "Connection failed: " . $conn->connect_error;
    header("location: ../index.php");
    exit();
}

// MODO SEGURO: Usar prepared statement
$sql = "SELECT * FROM users WHERE USEREMAIL = ?";
$result = selectSafeQuery($conn, $sql, "s", [$useremail]);

if ($result->num_rows > 0) {
    $row = $result->fetch_array(MYSQLI_ASSOC);
    
    if ($userpwd == $row["USERPASSWORD"]) {
        $_SESSION["userlogged"] = $row["USERNICKNAME"];
        $_SESSION["userid"] = $row["USERID"];
        header("location: ../home.php");
    } else {
        $_SESSION["error"] = "Username/password incorrect";
        header("location: ../index.php");
    }
} else {
    $_SESSION["error"] = "Username/password incorrect";
    header("location: ../index.php");
}

$conn->close();
?>
```

---

## ✅ Solução 3: Validação de Entrada + Prepared Statements

**Camadas de Defesa (Defense in Depth):**

```php
<?php

// CAMADA 1: Validação de Tipo/Formato
function validateEmail($email) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    return strlen($email) <= 250; // Limita tamanho
}

function validateNickname($nickname) {
    // Apenas letras, números, underscore, hífen
    if (!preg_match('/^[a-zA-Z0-9_-]{3,50}$/', $nickname)) {
        return false;
    }
    return true;
}

function validatePassword($password) {
    return strlen($password) >= 6 && strlen($password) <= 100;
}

// Uso em createuser.php
$useremail = $_POST["txtEmail"];
$usernickname = $_POST["txtNickname"];
$userpwd = $_POST["txtPwd"];

// Validação de entrada
if (!validateEmail($useremail)) {
    $_SESSION["error"] = "Email inválido!";
    header("location: ../newuser.php");
    exit();
}

if (!validateNickname($usernickname)) {
    $_SESSION["error"] = "Nickname deve ter 3-50 caracteres (letras, números, underscore)";
    header("location: ../newuser.php");
    exit();
}

if (!validatePassword($userpwd)) {
    $_SESSION["error"] = "Senha deve ter 6-100 caracteres";
    header("location: ../newuser.php");
    exit();
}

// CAMADA 2: Prepared Statement
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

$sql = "SELECT USERID FROM users WHERE USERNICKNAME = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usernickname);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $_SESSION["error"] = "Nickname já existe!";
    header("location: ../newuser.php");
    exit();
}

// Proceder com inserção segura...
?>
```

---

## ✅ CRÍTICO: Resolver `dbu.php`

### Opção A: Remover Completamente (RECOMENDADO)
```php
// ❌ NUNCA deixar em produção - permite SQL arbitrário
// Remova `/action/dbu.php` completamente
```

### Opção B: Se Precisar Manter Apenas para Admin
```php
<?php
session_start();

// SEGURANÇA: Apenas admin pode acessar
if (!isset($_SESSION["userid"]) || $_SESSION["userid"] != 1) {
    die("Acesso negado!");
}

// SEGURANÇA: Whitelist apenas SELECT (leitura)
$dbsql = trim($_POST["txtSQL"] ?? "");

if ($dbsql && strtoupper(substr(trim($dbsql), 0, 6)) !== "SELECT") {
    die("Apenas queries SELECT são permitidas!");
}

// Mesmo assim, é arriscado. Melhor usar uma interface com campos específicos
?>
```

**Solução Ideal**: Criar formulário com campos específicos em vez de textarea livre:
```html
<!-- Criar /action/dbu-safe.php com formulário estruturado -->
<form method="POST">
    <label>Tabela:</label>
    <select name="table">
        <option>users</option>
        <option>bets</option>
        <option>matches</option>
    </select>
    
    <label>Coluna para pesquisa:</label>
    <input type="text" name="column">
    
    <label>Valor:</label>
    <input type="text" name="value">
    
    <input type="submit" value="Pesquisar">
</form>

<?php
// Construir query com prepared statement baseado em seleções
$table = $_POST["table"];
$column = $_POST["column"];
$value = $_POST["value"];

// Validar tabela (whitelist)
$allowed_tables = ["users", "bets", "matches"];
if (!in_array($table, $allowed_tables)) {
    die("Tabela inválida");
}

// Query segura
$sql = "SELECT * FROM $table WHERE $column = ?";
// ... rest do código com prepared statement
?>
```

---

## 📋 Checklist de Implementação

### Fase 1: Arquivos Críticos (Prioridade Alta)
- [ ] `/action/login.php` - Converter para prepared statements
- [ ] `/action/createuser.php` - Converter para prepared statements  
- [ ] `/action/dbu.php` - **REMOVER em produção** ou restringir severamente
- [ ] `/action/sendpwd.php` - Revisar e converter SQL

### Fase 2: Arquivos Secundários
- [ ] Todos os arquivos em `/action/*-updatebets.php` - Converter SQL
- [ ] `/action/selected-showbets.php` - Revisar queries
- [ ] Todos os `*-showgrouporder.php` - Revisar queries

### Fase 3: Validação de Entrada
- [ ] Criar `/action/validators.php` com funções de validação
- [ ] Aplicar validação em TODOS os formulários
- [ ] Implementar `filter_var()` e regex patterns

### Fase 4: Testes
- [ ] Testar login com `' OR '1'='1` (deve ser rejeitado)
- [ ] Testar nickname com `'; DROP TABLE users; --` (deve ser rejeitado)
- [ ] Usar ferramentas como SQLMap para teste automático

---

## 🛡️ Defesas Adicionais Além do SQL Injection

### 1. Prepared Statements ✅ (Este documento)
Previne: SQL Injection
```php
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
```

### 2. Input Validation ✅
Previne: Dados inválidos
```php
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) die("Email inválido");
```

### 3. Output Encoding 🔒
Previne: XSS (Cross-Site Scripting)
```php
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');
```

### 4. Least Privilege DB User 🔒
**Criar usuário restrito em MySQL:**
```sql
CREATE USER 'bolao_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON cup2018.* TO 'bolao_app'@'localhost';
-- NÃO dar DROP, DELETE, ALTER
```

Usar esse usuário em `login.php`, etc. Em vez de `root`.

### 5. Hashing de Senhas 🔒
**CRÍTICO**: Senhas em plaintext são inaceitáveis!
```php
// ERRADO (código atual)
if ($userpwd == $row["USERPASSWORD"]) { }

// CORRETO
if (password_verify($userpwd, $row["USERPASSWORD_HASH"])) { }

// Ao registrar:
$password_hash = password_hash($_POST["txtPwd"], PASSWORD_BCRYPT);
```

---

## 📚 Recursos e Referências

### Documentação Oficial
- **PHP MySQLi**: https://www.php.net/manual/en/mysqli.quickstart.prepared-statements.php
- **OWASP SQL Injection**: https://owasp.org/www-community/attacks/SQL_Injection
- **PHP.net Filter Functions**: https://www.php.net/manual/en/ref.filter.php

### Boas Práticas
1. **Always use Prepared Statements** para queries com entrada do usuário
2. **Valide TUDO** antes de usar em SQL (nunca confie em cliente)
3. **Use whitelist validation** quando possível (ex: IDs, enums)
4. **Implemente logging** de queries suspeitas
5. **Erro messages genéricas** - não revele estrutura do banco: "Dados não encontrados" em vez de "USEREMAIL não existe na tabela users"

---

## ⏱️ Timeline de Implementação Recomendada

1. **Semana 1**: Criar `db-helper.php` e converter `login.php`, `createuser.php`
2. **Semana 2**: Converter `/action/*-showbets.php` e similares
3. **Semana 3**: Remover/restringir `dbu.php`, implementar validação
4. **Semana 4**: Teste de segurança, hashing de senhas
5. **Semana 5**: Deploy + monitoramento

---

## 🆘 Teste Rápido de Vulnerabilidade

**Como um atacante testaria o sistema:**

1. Na página de login, no campo "Email", entrar:
   ```
   admin@test.com' OR '1'='1
   ```
   Se entrar sem erro, é vulnerável!

2. No campo "Nickname", entrar:
   ```
   test'; DELETE FROM users; --
   ```
   Se tabela users desaparecer, é CRÍTICO!

3. Acessar `dbu.php` e executar:
   ```sql
   SHOW TABLES;
   ```
   Se conseguir listar, remova `dbu.php` imediatamente!

---

## ✅ Conclusão

A implementação de **Prepared Statements** é a solução mais eficaz contra SQL Injection. Combinar com validação de entrada e configuração correta de permissões no banco oferece defesa em profundidade.

**Prioridade**: 🔴 CRÍTICA - Implementar nas próximas 2-3 semanas
