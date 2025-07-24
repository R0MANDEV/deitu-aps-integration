# Deitu-APS Integration

Configuración para conectar el frontend **Deitu** con el backend **APS** a través de Docker, resolviendo problemas de conectividad de red entre contenedores.

## 🎯 Descripción del problema

Los contenedores Docker de Deitu no podían conectar directamente con el servidor APS (`10.189.3.23:443`) debido a:
- Redes Docker aisladas 
- Problemas de firewall/routing entre subredes
- Refresh tokens expirados

## ✅ Solución implementada

1. **Proxy local**: `aps-proxy.js` maneja las conexiones HTTPS con APS
2. **Network host**: El contenedor mbaas usa la red del host para acceso completo
3. **Configuración actualizada**: Tokens válidos y URLs de proxy configuradas
4. **Proxy frontend**: Vite configurado para conectar con la IP del host

---

## 🚀 Instalación en otro ordenador

### **Paso 1: Tener el proyecto deitu-softphone**
```bash
git clone [repo-deitu-softphone]
cd deitu-softphone
```

### **Paso 2: Descargar los cambios de integración**
```bash
git clone https://github.com/R0MANDEV/deitu-aps-integration.git
```

### **Paso 3: Copiar los archivos modificados**
```bash
# Desde deitu-aps-integration/ hacia deitu-softphone/
cp deitu-aps-integration/docker-compose.yml ./
cp deitu-aps-integration/aps-proxy.js ./
cp deitu-aps-integration/mbaas/configs/config.dev.yml ./mbaas/configs/
cp deitu-aps-integration/mbaas/configs/config.localdev.yml ./mbaas/configs/ 
cp deitu-aps-integration/uac/webphone/vite.config.ts ./uac/webphone/
```

### **Paso 4: Instalar dependencia del proxy**
```bash
npm install http-proxy
```

### **Paso 5: Configurar IP del nuevo ordenador**
```bash
# 1. Obtener IP del host
ip route get 1 | awk '{print $7}' | head -1
# Ejemplo output: 192.168.1.150

# 2. Editar uac/webphone/vite.config.ts
# Cambiar línea 16: 
target: 'http://192.168.1.150:8080',  # <- Usar tu IP aquí
```

### **Paso 6: Ejecutar**
```bash
# Terminal 1: Iniciar proxy APS
node aps-proxy.js

# Terminal 2: Iniciar contenedores Docker
docker-compose up -d
```

### **Paso 7: Probar que funciona**
```bash
# Test completo
curl -k https://10.189.10.10:3000/api/login_theme

# Debe devolver datos JSON del tema de login
```

---

## 📁 Archivos modificados

Este repositorio contiene 5 archivos modificados:

- `docker-compose.yml` - Network mode host para mbaas, puerto MongoDB
- `aps-proxy.js` - Proxy Node.js para APS (nuevo archivo)
- `mbaas/configs/config.dev.yml` - Refresh token actualizado
- `mbaas/configs/config.localdev.yml` - Configuración proxy y red
- `uac/webphone/vite.config.ts` - Proxy del frontend (⚠️ requiere configurar IP)

## 🌐 URLs de acceso

- **Frontend Deitu**: https://10.189.10.10:3000
- **API mbaas**: http://localhost:8080/api/
- **Proxy APS**: http://localhost:3023

## 🔧 Arquitectura de la solución

```
Frontend Deitu (10.189.10.10:3000)
    ↓ [vite proxy]
mbaas (host:8080) 
    ↓ [http request]
APS Proxy (localhost:3023)
    ↓ [https request] 
APS Backend (10.189.3.23:443) ✅
```

## 🐛 Troubleshooting

### ❌ Error: "connect EHOSTUNREACH"
- **Causa**: Proxy APS no está corriendo o IP incorrecta
- **Solución**: 
  ```bash
  # Verificar proxy corriendo
  node aps-proxy.js
  
  # Verificar IP en vite.config.ts
  ip route get 1 | awk '{print $7}' | head -1
  ```

### ❌ Error: "dial tcp timeout"  
- **Causa**: No hay conectividad con APS
- **Solución**:
  ```bash
  # Probar conectividad directa
  curl -k https://10.189.3.23/aps/api/token/refresh -d "refresh_token=test"
  ```

### ❌ Error: "Cannot assign requested address"
- **Causa**: Configuración de red Docker incorrecta
- **Solución**: Verificar que mbaas use `network_mode: host` en docker-compose.yml

---

## 🤔 ¿Por qué estos pasos?

1. **Clonar deitu-aps-integration**: Obtiene los 5 archivos modificados con la solución
2. **Copiar archivos**: Sobrescribe los archivos originales con los cambios necesarios
3. **IP del host**: Cada ordenador tiene IP diferente, hay que configurarla
4. **Proxy APS**: Resuelve el problema de conectividad entre Docker y APS
5. **Network host**: Permite que mbaas acceda a la red completa del host




## Tener en cuenta en APS
Agregar como URL la de deitu "https://10.189.10.10:3000" y que el client la tenga seleccionada como su url


**La integración Docker entre Deitu (frontend) y APS (backend) estará funcionando** ✅