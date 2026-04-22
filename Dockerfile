# ══════════════════════════════════════════════════════════════════
# Stage 1 — Build all React/Vite SPAs
# ══════════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder-node

# ── Build args: VITE_* vars se queman en el bundle en build time ──
ARG VITE_API_URL=http://192.168.0.25:6500/api
ARG VITE_API_CONTACT=http://192.168.0.25:6500/api/contact
ARG VITE_COMMENTS_API=http://192.168.0.25:6500/api/mharnes/comments
ARG VITE_API_BASE=/api

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_CONTACT=${VITE_API_CONTACT}
ENV VITE_COMMENTS_API=${VITE_COMMENTS_API}
ENV VITE_API_BASE=${VITE_API_BASE}

# ── Don Emilio ────────────────────────────────────────────────────
WORKDIR /build/donemilio
COPY webs/DonEmilio/package*.json ./
RUN npm ci
COPY webs/DonEmilio/ ./
RUN npm run build

# ── Duy Amis ─────────────────────────────────────────────────────
WORKDIR /build/duyamis
COPY webs/DuyAmis/package*.json ./
RUN npm ci
COPY webs/DuyAmis/ ./
RUN npm run build

# ── Mharnes ──────────────────────────────────────────────────────
WORKDIR /build/mharnes
COPY webs/Mharnes/package*.json ./
RUN npm ci
COPY webs/Mharnes/ ./
RUN npm run build

# ── Grupo Don Emilio (Hub) ────────────────────────────────────────
WORKDIR /build/grupodonemilio
COPY webs/GrupoDonEmilio/package*.json ./
RUN npm ci
COPY webs/GrupoDonEmilio/ ./
RUN npm run build


# ══════════════════════════════════════════════════════════════════
# Stage 2 — Python runtime con ODBC Driver 17 para SQL Server
# ══════════════════════════════════════════════════════════════════
FROM python:3.11-slim AS runtime

# ── Instalar ODBC Driver 17 (Debian 12 / Bookworm) ───────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl gnupg2 apt-transport-https ca-certificates \
    && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
        | gpg --dearmor -o /usr/share/keyrings/microsoft.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft.gpg] \
        https://packages.microsoft.com/debian/12/prod bookworm main" \
        > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends \
        msodbcsql17 \
        unixodbc-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Dependencias Python ───────────────────────────────────────────
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# ── Código fuente de la API ───────────────────────────────────────
COPY main.py database.py ./
COPY models/      ./models/
COPY routers/     ./routers/
COPY schemas/     ./schemas/
COPY services/    ./services/
COPY middlewares/ ./middlewares/
COPY utils/       ./utils/
COPY migrations/  ./migrations/

# ── SPAs compiladas (los nombres deben coincidir con main.py) ─────
COPY --from=builder-node /build/donemilio/dist      /app/donemilio
COPY --from=builder-node /build/duyamis/dist        /app/duyamis
COPY --from=builder-node /build/mharnes/dist        /app/mharnes
COPY --from=builder-node /build/grupodonemilio/dist /app/grupo-don-emilio

# ── Directorio de uploads (montado como volumen en prod) ──────────
RUN mkdir -p /app/uploads

EXPOSE 6500

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "6500"]
