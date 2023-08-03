export function getGeneAnnotation(width, height) {
  return  {
    title: "GENES",
    "template": "gene",
    "data": {
      "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
      "type": "beddb",
      "genomicFields": [
        {"index": 1, "name": "start"},
        {"index": 2, "name": "end"}
      ],
      "valueFields": [
        {"index": 5, "name": "strand", "type": "nominal"},
        {"index": 3, "name": "name", "type": "nominal"}
      ],
      "exonIntervalFields": [
        {"index": 12, "name": "start"},
        {"index": 13, "name": "end"}
      ]
    },
    "encoding": {
      "startPosition": {"field": "start"},
      "endPosition": {"field": "end"},
      "strandColor": {"field": "strand", "range": ["gray"]},
      "strandRow": {"field": "strand"},
      "opacity": {"value": 0.4},
      "geneHeight": {"value": height / 5.0},
      "geneLabel": {"field": "name"},
      "geneLabelFontSize": {"value": height / 5.0},
      "geneLabelColor": {"field": "strand", "range": ["gray"]},
      "geneLabelStroke": {"value": "white"},
      "geneLabelStrokeThickness": {"value": 4},
      "geneLabelOpacity": {"value": 1},
      "type": {"field": "type"}
    },
    width,
    height
  };
}