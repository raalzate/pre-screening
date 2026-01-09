
Actúa como un experto en [tecnología/área].

Tu tarea es generar un archivo JSON con una estructura para [propósito del JSON, ej. una evaluación técnica, una guía de configuración, un plan de estudios].

El JSON debe tener la siguiente estructura:
{
  "id": "el-id-de-la-evaluacion",
  "title": "El título de la evaluación",
  "categories": [
    {
      "id": "id-de-la-categoria",
      "title": "Título de la categoría",
      "questions": [
        {
          "id": "id-de-la-pregunta",
          "question": "El texto de la pregunta.",
          "type": "El tipo de pregunta (ej. 'scale').",
          "scaleMax": "El número máximo de la escala, que siempre será 5.",
          "example": "Un ejemplo práctico o de código relacionado con la pregunta que ilustre el nivel 3 o 4 de la escala."
        }
      ]
    }
  ]
}

Ten en cuenta las siguientes especificaciones:
* **Tecnología:** El contenido debe estar 100% enfocado en [tecnología específica, ej. Python Backend, Docker, C++].
* **Nivel:** El nivel de conocimiento a evaluar es [nivel de experiencia, ej. Semi-Senior, Senior].
* **Categorías:** Crea al menos [número] categorías relevantes para el nivel y la tecnología.
* **Preguntas:** Incluye un mínimo de [número] preguntas por categoría.
* **Ejemplos:** Cada pregunta debe contener el campo 'example' con un ejemplo conciso y relevante que se adapte al nivel de la evaluación.
* **Criterios de la Escala (para cada pregunta):**
  * **0 = No conoce:** La persona no tiene conocimiento alguno de la tecnología o concepto.
  * **1 = Conocimiento muy básico o teórico mínimo:** Conoce la existencia de la tecnología, pero no tiene experiencia práctica ni ejemplos claros.
  * **2 = Conocimiento teórico y algo de práctica limitada:** Ha visto o experimentado superficialmente, pero su experiencia no es suficiente para un proyecto real.
  * **3 = Experiencia práctica en proyectos:** Puede mencionar ejemplos de proyectos donde ha aplicado el conocimiento, pero con áreas de mejora claras.
  * **4 = Experiencia sólida y autónoma en proyectos reales:** Ha liderado o participado con autonomía en proyectos de cierta envergadura; comprende la mayoría de los matices y trade-offs; puede explicar cómo resolvió retos.
  * **5 = Dominio profundo y liderazgo/innovación:** Ha liderado equipos o proyectos críticos donde introdujo o mejoró significativamente la práctica, el código o la arquitectura.
* **Idiomas:** El contenido debe estar en [idioma, ej. español].

