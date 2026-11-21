-- El Gremio · esquema para el portal de agremiados
-- Ejecutar en Database Actions > SQL como usuario EL_GREMIO (botón "Ejecutar script", F5)

CREATE TABLE miembros (
  id                NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo            VARCHAR2(30)  NOT NULL,
  nombre            VARCHAR2(120) NOT NULL,
  correo            VARCHAR2(160),
  password_hash     VARCHAR2(100) NOT NULL,           -- bcrypt, nunca texto plano
  estado            VARCHAR2(10)  DEFAULT 'ACTIVO' NOT NULL,
  fecha_ingreso     DATE          DEFAULT SYSDATE NOT NULL,
  ultimo_acceso     TIMESTAMP,
  intentos_fallidos NUMBER        DEFAULT 0 NOT NULL,
  bloqueado_hasta   TIMESTAMP,
  CONSTRAINT miembros_codigo_uq UNIQUE (codigo),
  CONSTRAINT miembros_estado_ck CHECK (estado IN ('ACTIVO','INACTIVO'))
);

CREATE TABLE contenido_miembros (
  id          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo      VARCHAR2(160) NOT NULL,
  descripcion VARCHAR2(600),
  url         VARCHAR2(400),
  pilar       VARCHAR2(30),                           -- educacion, empresa, networking, social
  publicado   NUMBER(1)     DEFAULT 1 NOT NULL,
  fecha       DATE          DEFAULT SYSDATE NOT NULL,
  CONSTRAINT contenido_pilar_ck CHECK (pilar IS NULL OR pilar IN ('educacion','empresa','networking','social'))
);

-- Contenido de ejemplo (reemplázalo por el real)
INSERT INTO contenido_miembros (titulo, descripcion, pilar) VALUES
  ('Bienvenido al Gremio', 'Aquí encontrarás los beneficios y recursos reservados a agremiados.', NULL);
INSERT INTO contenido_miembros (titulo, descripcion, pilar) VALUES
  ('Calendario de formación', 'Próximas sesiones de educación empresarial.', 'educacion');
INSERT INTO contenido_miembros (titulo, descripcion, pilar) VALUES
  ('Directorio de agremiados', 'Conecta y haz negocios con otros miembros.', 'networking');
COMMIT;

-- Los miembros se crean con scripts/crear-miembro.js (genera el hash bcrypt).
