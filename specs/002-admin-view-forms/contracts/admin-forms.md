# Admin Forms API Contracts

## List Forms
`GET /api/admin/forms`

### Response
`200 OK`
```json
[
  {
    "id": "angular-frontend",
    "title": "Auto-Evaluación Técnica - Angular Frontend"
  },
  {
    "id": "springboot-backend",
    "title": "Auto-Evaluación Técnica - Springboot Backend"
  }
]
```

---

## Get Form Detail
`GET /api/admin/forms/[id]`

### Response
`200 OK`
```json
{
  "id": "angular-frontend",
  "title": "Auto-Evaluación Técnica - Angular Frontend",
  "categories": [
    {
      "id": "core-engineering",
      "title": "Ingeniería de Software y Core Angular",
      "questions": [
        {
          "id": "buenas-practicas",
          "question": "¿Cómo calificarías tu capacidad...?",
          "type": "scale",
          "scaleMax": 5,
          "example": "Uso de 'Strict Mode'..."
        }
      ]
    }
  ]
}
```

`404 Not Found`
- If the form ID does not exist in `data/forms/`.
