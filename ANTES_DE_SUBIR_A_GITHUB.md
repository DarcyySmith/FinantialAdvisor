# ✅ Checklist: Antes de Subir a GitHub

## 🔒 Seguridad - CRÍTICO

### 1. Verifica que NO tengas un archivo `.env` con tu API key
```bash
# Ejecuta este comando en la terminal:
ls -la | grep .env

# Si ves un archivo .env, asegúrate de que:
# ✅ Está en .gitignore (ya está configurado)
# ✅ NO lo agregues con git add
```

### 2. Verifica el .gitignore
```bash
# El archivo .gitignore YA está actualizado con:
# ✅ .env (todas las variantes)
# ✅ node_modules/
# ✅ .expo/
# ✅ Archivos de build
```

### 3. Revisa qué archivos se subirán
```bash
git status

# Asegúrate de que NO aparezcan:
# ❌ .env
# ❌ node_modules/
# ❌ Archivos con API keys
```

## 📦 Preparar el Repositorio

### 1. Inicializar Git (si no lo has hecho)
```bash
git init
```

### 2. Agregar archivos
```bash
# Agregar todos los archivos seguros
git add .

# Verificar qué se agregó
git status
```

### 3. Hacer el primer commit
```bash
git commit -m "Initial commit: SmartFinance Advisor con IA"
```

### 4. Crear repositorio en GitHub
1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `SmartFinanceAdvisor` (o el que prefieras)
3. Descripción: "Asesor financiero personal con IA - React Native + Expo"
4. **NO** inicialices con README (ya tienes uno)
5. Haz clic en "Create repository"

### 5. Conectar y subir
```bash
# Reemplaza TU_USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/SmartFinanceAdvisor.git

# Subir el código
git branch -M main
git push -u origin main
```

## 📝 Archivos Importantes Incluidos

✅ **README.md** - Documentación completa del proyecto
✅ **.gitignore** - Protección de archivos sensibles
✅ **.env.example** - Ejemplo de configuración (sin claves reales)
✅ **INSTRUCCIONES_CHAT_IA.md** - Guía para configurar el chat
✅ **package.json** - Dependencias del proyecto
✅ **Código fuente** - App.tsx, ChatScreen.tsx, etc.

## ⚠️ Archivos que NUNCA debes subir

❌ **.env** - Contiene tu API key de OpenAI
❌ **node_modules/** - Dependencias (se instalan con npm install)
❌ **.expo/** - Archivos temporales de Expo
❌ **Archivos con claves o tokens**

## 🎯 Después de Subir

### Para otros usuarios que clonen tu repo:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/TU_USUARIO/SmartFinanceAdvisor.git
   cd SmartFinanceAdvisor
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar API key (opcional)**
   ```bash
   # Crear archivo .env
   echo "OPENAI_API_KEY=su_clave_aqui" > .env
   ```

4. **Ejecutar**
   ```bash
   npm start
   ```

## 🔐 Buenas Prácticas

### Si accidentalmente subes tu API key:

1. **Revoca la clave inmediatamente** en [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Genera una nueva clave**
3. **Limpia el historial de Git** (es complicado, mejor prevenir)

### Para mantener tu repo seguro:

```bash
# Antes de cada commit, verifica:
git status

# Asegúrate de que .env NO aparezca en la lista
```

## ✨ Comandos Útiles de Git

```bash
# Ver estado actual
git status

# Ver qué archivos están ignorados
git status --ignored

# Ver diferencias antes de commit
git diff

# Agregar archivos específicos
git add archivo.txt

# Commit con mensaje
git commit -m "Descripción del cambio"

# Subir cambios
git push

# Ver historial
git log --oneline
```

## 🎉 ¡Listo!

Tu proyecto está listo para GitHub con:
- ✅ Seguridad configurada
- ✅ Documentación completa
- ✅ .gitignore protegiendo archivos sensibles
- ✅ README profesional
- ✅ Instrucciones claras para usuarios

**Recuerda:** Nunca compartas tu API key de OpenAI. Si alguien quiere usar el chat con IA, debe obtener su propia clave.
