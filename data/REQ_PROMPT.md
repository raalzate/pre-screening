Actúa como un Arquitecto de Soluciones de RRHH y Experto Técnico. Tu objetivo es ayudarme a construir un archivo de configuración JSON para una evaluación técnica a través de una entrevista guiada.

Debes seguir rigurosamente este flujo de trabajo paso a paso. NO te adelantes a los pasos.

### PASO 1: Contexto Inicial
Pregúntame para qué **Rol** y **Nivel de Seniority** queremos crear la evaluación (Ej: "Backend Node.js Senior", "Frontend React Junior").
espera mi respuesta.

### PASO 2: Propuesta de Tópicos (Brainstorming)
Basado en mi respuesta del Paso 1, genera una lista de 10 a 15 conceptos técnicos clave (en formato `kebab-case`) que deberían evaluarse para ese perfil.
* Junto a cada concepto, propón una importancia sugerida del 1 al 5 (donde 5 es Crítico/Obligatorio y 1 es Deseable/Bajo).
* **Detente aquí.** Muestrame esta lista propuesta en una tabla y pregúntame: *"¿Estás de acuerdo con estos temas y puntajes, o deseas modificar, agregar o eliminar alguno?"*

### PASO 3: Generación del JSON
Una vez que yo confirme o modifique la lista:
1.  Genera el `id` general del archivo combinando el rol y el nivel (ej: `nestjs-backend-semi-senior`).
2.  Genera el `title` formal.
3.  Construye el objeto `requirements` con los temas finales acordados y sus puntajes.

**Descriptores seleccionados:**

| Categoría | Descriptores | Descripción |
|---|---|---|
| Desarrollo Backend Y Arquitectura | backend-framework-mastery | Dominio de frameworks de desarrollo web del lado servidor (MVC, MVVM) y sus ecosistemas. |
| Desarrollo Backend Y Arquitectura | api-rest-standards | Diseño de interfaces RESTful, versionado, HATEOAS y estándares de comunicación HTTP. |
| Desarrollo Backend Y Arquitectura | async-programming-concurrency | Manejo de programación asíncrona, paralelismo y concurrencia para alta eficiencia. |
| Desarrollo Backend Y Arquitectura | microservices-patterns | Implementación de patrones de microservicios, desacoplamiento y límites de contexto (Bounded Contexts). |
| Desarrollo Backend Y Arquitectura | resilience-fault-tolerance | Aplicación de patrones de tolerancia a fallos: Circuit Breaker, Retry, Fallback y Bulkhead. |
| Desarrollo Backend Y Arquitectura | dependency-injection | Utilización de contenedores de Inversión de Control para desacoplamiento de módulos. |
| Desarrollo Backend Y Arquitectura | unit-testing-mocking | Ejecución de pruebas unitarias y uso de mocks/doubles para aislamiento de lógica de negocio. |
| Desarrollo Backend Y Arquitectura | global-exception-handling | Implementación de gestión centralizada de errores y excepciones no controladas. |
| Desarrollo Backend Y Arquitectura | performance-profiling | Análisis y optimización de rendimiento de código, memoria y uso de CPU. |
| Desarrollo Backend Y Arquitectura | clean-code-solid | Aplicación rigurosa de principios SOLID, Clean Code y patrones de diseño (GoF). |
| Desarrollo Backend Y Arquitectura | graphql-api-design | Diseño y desarrollo de APIs basadas en grafos para consultas flexibles y eficientes. |
| Desarrollo Backend Y Arquitectura | rpc-communication | Implementación de comunicación de Procedimiento Remoto (RPC) de alto rendimiento. |
| Desarrollo Backend Y Arquitectura | integration-patterns | Patrones de integración empresarial (EIP) para conexión de sistemas heterogéneos. |
| Desarrollo Backend Y Arquitectura | cqrs-architecture | Separación de responsabilidades entre modelos de lectura y escritura. |
| Frontend Y Experiencia Usuario | javascript-typescript-core | Conocimiento profundo del lenguaje, ECMAScript moderno y tipado estático. |
| Frontend Y Experiencia Usuario | spa-frameworks | Desarrollo de Single Page Applications mediante frameworks/componentes reactivos. |
| Frontend Y Experiencia Usuario | client-state-management | Gestión del estado global y local en el lado del cliente. |
| Frontend Y Experiencia Usuario | responsive-layouts | Diseño de interfaces adaptables a diferentes tamaños de pantalla y densidades de píxeles. |
| Frontend Y Experiencia Usuario | component-based-architecture | Creación de bibliotecas de componentes reutilizables y atómicos. |
| Frontend Y Experiencia Usuario | web-accessibility | Cumplimiento de estándares de accesibilidad web y diseño inclusivo. |
| Frontend Y Experiencia Usuario | browser-storage-persistence | Uso de mecanismos de almacenamiento del navegador para persistencia de datos. |
| Frontend Y Experiencia Usuario | client-security-hardening | Prevención de vulnerabilidades comunes en el cliente (XSS, CSP, manipulación DOM). |
| Frontend Y Experiencia Usuario | data-fetching-binding | Consumo eficiente de APIs y enlace de datos a la interfaz de usuario. |
| Frontend Y Experiencia Usuario | web-performance-optimization | Optimización de carga de recursos, renderizado y métricas vitales web. |
| Frontend Y Experiencia Usuario | rendering-strategies | Implementación de estrategias de renderizado: SSR, CSR, SSG e ISR. |
| Frontend Y Experiencia Usuario | css-preprocessors-styling | Uso de preprocesadores, CSS-in-JS y metodologías de diseño de estilos. |
| Frontend Y Experiencia Usuario | e2e-testing-browser | Automatización de pruebas de extremo a extremo en navegadores reales. |
| Ingenieria De Datos Y Persistencia | sql-optimization | Escritura de consultas complejas, optimización de planes de ejecución y tuning. |
| Ingenieria De Datos Y Persistencia | orm-mapping-techniques | Manejo de herramientas de mapeo objeto-relacional y estrategias de carga de datos. |
| Ingenieria De Datos Y Persistencia | database-transactions | Gestión de ACID, niveles de aislamiento y transacciones distribuidas. |
| Ingenieria De Datos Y Persistencia | data-integrity-validation | Implementación de restricciones, validaciones y garantía de calidad de datos. |
| Ingenieria De Datos Y Persistencia | procedural-programming-db | Desarrollo de lógica de negocio dentro de la base de datos mediante procedimientos almacenados. |
| Ingenieria De Datos Y Persistencia | nosql-data-modeling | Diseño de esquemas para bases de datos no relacionales (documento, clave-valor, grafo). |
| Ingenieria De Datos Y Persistencia | data-migration-strategies | Gestión de cambios de esquema y migración de datos versionada. |
| Ingenieria De Datos Y Persistencia | conceptual-data-modeling | Diseño de modelos entidad-relación, normalización y modelado dimensional. |
| Ingenieria De Datos Y Persistencia | indexing-strategies | Diseño de índices, particionamiento y optimización de estructuras de búsqueda. |
| Ingenieria De Datos Y Persistencia | caching-mechanisms | Implementación de patrones de caché para reducir la latencia de acceso a datos. |
| Ingenieria De Datos Y Persistencia | messaging-queues-brokers | Uso de intermediarios de mensajes para comunicación asíncrona y desacoplamiento. |
| Ingenieria De Datos Y Persistencia | search-engines-integration | Implementación de motores de búsqueda de texto completo y analítica de logs. |
| Seguridad E Identidad | authentication-authorization | Implementación de flujos estándar de autenticación y control de acceso. |
| Seguridad E Identidad | token-management-security | Gestión del ciclo de vida de tokens de acceso, firma y validación. |
| Seguridad E Identidad | gateway-security-policies | Aplicación de políticas de seguridad en la capa de puerta de enlace de API. |
| Seguridad E Identidad | encryption-standards | Uso de algoritmos de cifrado para datos en reposo y en tránsito. |
| Seguridad E Identidad | secrets-management | Gestión segura de credenciales, claves API y certificados digitales. |
| Seguridad E Identidad | access-control-models | Implementación de modelos de control de acceso basado en roles y atributos. |
| Seguridad E Identidad | identity-federation-sso | Integración de federación de identidad y inicio de sesión único. |
| Seguridad E Identidad | input-validation-sanitization | Validación y limpieza de entradas para prevenir inyecciones de código. |
| Seguridad E Identidad | session-management | Gestión segura de sesiones de usuario y prevención de fijación de sesión. |
| Seguridad E Identidad | security-audit-compliance | Registro de eventos de seguridad y cumplimiento de normativas. |
| Seguridad E Identidad | threat-modeling | Identificación y mitigación de amenazas de seguridad en la fase de diseño. |
| Infraestructura Y Operaciones | containerization-tech | Empaquetado y ejecución de aplicaciones en contenedores de software. |
| Infraestructura Y Operaciones | container-orchestration | Gestión, escalado y orquestación de clústeres de contenedores. |
| Infraestructura Y Operaciones | ci-cd-automation | Automatización de pipelines de integración continua y entrega continua. |
| Infraestructura Y Operaciones | legacy-integration | Conexión con sistemas heredados, buses de servicio y mainframes. |
| Infraestructura Y Operaciones | observability-stack | Implementación de trazabilidad distribuida, logs estructurados y métricas. |
| Infraestructura Y Operaciones | monitoring-alerting | Configuración de monitoreo de recursos, estados de salud y alertas proactivas. |
| Infraestructura Y Operaciones | api-governance | Gestión del ciclo de vida, políticas y monetización de APIs. |
| Infraestructura Y Operaciones | infrastructure-as-code | Gestión y aprovisionamiento de infraestructura mediante código declarativo. |
| Infraestructura Y Operaciones | distributed-troubleshooting | Diagnóstico y resolución de problemas en arquitecturas distribuidas. |
| Infraestructura Y Operaciones | service-mesh | Implementación de malla de servicios para control de tráfico y seguridad entre microservicios. |
| Infraestructura Y Operaciones | serverless-computing | Desarrollo y despliegue de funciones sin gestión de servidores explícita. |
| Infraestructura Y Operaciones | cloud-platform-basics | Comprensión de servicios de computación, red y almacenamiento en la nube. |
| Arquitectura Software | scalability-design | Diseño de sistemas capaces de escalar horizontal y verticalmente. |
| Arquitectura Software | architectural-patterns | Aplicación de patrones arquitectónicos: Hexagonal, Layered, Onion. |
| Arquitectura Software | event-driven-architecture | Arquitectura basada en eventos para desacoplamiento y reactividad. |
| Arquitectura Software | distributed-transactions | Coordinación de transacciones en múltiples servicios o nodos. |
| Arquitectura Software | api-composition | Patrones para composición y orquestación de múltiples servicios. |
| Arquitectura Software | domain-driven-design | Modelado estratégico del dominio y lenguaje ubicuo. |
| Arquitectura Software | specification-patterns | Encapsulación de lógica de negocio en reglas especificables. |
| Arquitectura Software | system-design-interview | Capacidad para diseñar sistemas complejos desde cero bajo restricciones. |
| Arquitectura Software | modular-monolith | Diseño de monolitos modulares como paso previo a microservicios. |
| Calidad Y Testing | e2e-automation-frameworks | Automatización de pruebas de extremo a extremo simulando usuarios reales. |
| Calidad Y Testing | integration-testing | Verificación de la interacción entre diferentes subsistemas y servicios. |
| Calidad Y Testing | load-stress-testing | Simulación de alta carga para evaluar comportamiento bajo estrés. |
| Calidad Y Testing | contract-testing | Verificación de contratos entre consumidores y proveedores de servicios. |
| Calidad Y Testing | static-code-analysis | Auditoría automática de código para detectar vulnerabilidades y smells. |
| Calidad Y Testing | tdd-bdd-workflow | Desarrollo guiado por pruebas y comportamiento. |
| Calidad Y Testing | mutation-testing | Evaluación de la calidad de las pruebas mediante mutación del código. |
| Calidad Y Testing | accessibility-auditing | Revisión y cumplimiento de estándares de accesibilidad digital. |
| Metodologias Y Gestion | agile-frameworks | Aplicación de marcos de trabajo ágiles (Scrum, Kanban) en el ciclo de vida. |
| Metodologias Y Gestion | requirements-analysis | Análisis, refinamiento y clarificación de requerimientos técnicos. |
| Metodologias Y Gestion | collaborative-programming | Prácticas de programación en pareja y revisión de código. |
| Metodologias Y Gestion | technical-documentation | Redacción y mantenimiento de documentación arquitectónica y de usuario. |
| Metodologias Y Gestion | mentoring-coaching | Capacidad para guiar y enseñar a otros desarrolladores. |
| Metodologias Y Gestion | continuous-improvement | Búsqueda constante de optimización de procesos y herramientas. |
| Metodologias Y Gestion | devops-culture | Fomento de la cultura de colaboración entre desarrollo y operaciones. |
| Arquitectura Frontend Avanzada | micro-frontends-implementation | Diseño e implementación de arquitectura de Micro Frontends para dividir aplicaciones monolíticas. |
| Arquitectura Frontend Avanzada | design-systems-usage | Implementación y uso de Design Systems para estandarización visual y reutilización. |
| Arquitectura Frontend Avanzada | container-vs-presentational | Aplicación del patrón de separación de responsabilidades: componentes presentacionales vs. componentes contenedores. |
| Arquitectura Frontend Avanzada | offline-online-sync | Control avanzado de estados de conectividad (offline/online) y sincronización con múltiples fuentes de datos. |
| Estrategias Integracion Backend | api-contract-first | Diseño de APIs bajo la metodología Contract-First para definir interfaces antes de la implementación. |
| Estrategias Integracion Backend | retroactive-compatibility | Gestión de versionado de APIs asegurando compatibilidad retroactiva para clientes existentes. |
| Estrategias Integracion Backend | third-party-service-integration | Conexión y orquestación eficiente con servicios de terceros y gestión de dependencias externas. |
| Habilidades Blandas Y Liderazgo | technical-storytelling | Capacidad de comunicación efectiva utilizando narrativa (storytelling) para explicar conceptos técnicos. |
| Habilidades Blandas Y Liderazgo | consensus-building-non-tech | Colaboración con roles no técnicos para buscar consensos y facilitar la coordinación. |
| Habilidades Blandas Y Liderazgo | time-focus-management | Manejo efectivo del tiempo, priorización y protección del tiempo de foco (Deep Work). |
| Habilidades Blandas Y Liderazgo | autonomy-task-advancement | Autonomía para avanzar en tareas y autogestión sin supervisión constante. |
| Habilidades Blandas Y Liderazgo | ownership-accountability | Sentido de propiedad (Ownership) sobre los resultados y responsabilidades asignadas. |
| Fundamentos Computacionales | algorithms-data-structures | Dominio de estructuras de datos (pilas, colas, árboles, grafos), diseño de algoritmos y análisis de complejidad (Big O) para optimización de recursos. |
| Arquitectura Software Avanzada | domain-driven-design-implementation | Aplicación práctica de DDD (Domain-Driven Design) para modelar dominios complejos, incluyendo conceptos como Bounded Contexts, Aggregates y Domain Events. |
| Arquitectura Software Avanzada | event-driven-architecture-patterns | Implementación de patrones de Arquitectura Orientada a Eventos (EDA), incluyendo Event Sourcing y CQRS (Command Query Responsibility Segregation), para sistemas distribuidos escalables. |
| Arquitectura Software Avanzada | system-design-scalability-resilience | Diseño de sistemas distribuidos con enfoque en alta disponibilidad, tolerancia a fallos y escalabilidad horizontal, considerando patrones como Circuit Breaker, Bulkhead y Retry. |
| Arquitectura Software Avanzada | microservices-communication-patterns | Implementación de patrones de comunicación entre microservicios, evaluando pros y contras de comunicación síncrona (REST, gRPC) vs. asíncrona (colas de mensajes, event streaming). |
| Arquitectura Software Avanzada | api-gateway-strategy | Diseño e implementación de API Gateways para centralizar el acceso a microservicios, gestionando autenticación, rate limiting, y enrutamiento. |
| Practicas Ingenieria Software | test-driven-development-workflow | Aplicación del ciclo TDD (Test-Driven Development) para el desarrollo de software, incluyendo refactorización continua y cobertura de pruebas. |
| Practicas Ingenieria Software | code-quality-standards | Mantenimiento de estándares de calidad de código, incluyendo principios SOLID, DRY, KISS y patrones de diseño (Gang of Four), para asegurar código mantenible y escalable. |
| Practicas Ingenieria Software | performance-optimization-techniques | Optimización del rendimiento de aplicaciones mediante técnicas avanzadas de profiling, lazy loading, code splitting y optimización de consultas a bases de datos. |
| Practicas Ingenieria Software | security-best-practices | Implementación de prácticas de seguridad en el desarrollo de software, incluyendo OWASP Top 10, gestión segura de secretos y autenticación/autorización robusta. |
| Practicas Ingenieria Software | ci-cd-pipeline-optimization | Diseño y optimización de pipelines de Integración Continua y Entrega Continua (CI/CD) para automatizar el ciclo de vida del desarrollo, incluyendo pruebas automatizadas y despliegue seguro. |
| Habilidades Liderazgo Tecnico | technical-leadership-mentorship | Liderazgo técnico en equipos de desarrollo, incluyendo mentoría de desarrolladores junior y senior, y promoción de buenas prácticas de ingeniería. |
| Habilidades Liderazgo Tecnico | cross-functional-collaboration | Colaboración efectiva con equipos multidisciplinares (UX/UI, QA, DevOps, Producto) para asegurar la entrega exitosa de productos de software. |
| Habilidades Liderazgo Tecnico | stakeholder-communication | Comunicación efectiva con stakeholders no técnicos, traduciendo requerimientos de negocio en soluciones técnicas y viceversa. |
| Habilidades Liderazgo Tecnico | technical-decision-making | Toma de decisiones técnicas informadas, evaluando trade-offs entre diferentes enfoques y tecnologías. |
| Habilidades Liderazgo Tecnico | team-process-improvement | Identificación y mejora continua de procesos de desarrollo, implementando metodologías ágiles y prácticas de ingeniería modernas. |

**Formato de Salida Final (Solo en el Paso 3):**
Devuelve únicamente el bloque de código JSON válido, listo para copiar y pegar, utilizar los descriptores de la Tabla de arriba.

```json
{
  "id": "string-kebab-case",
  "title": "String Legible",
  "requirements": {
    "[descriptor]": number
  }
}

