export function getOverview(width, height) {
  return {
    static: true,
    alignment: "overlay",
    title: "Whole Genome",
    "data": {
      "url": "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv",
      "type": "csv",
      "chromosomeField": "Chromosome",
      "genomicFields": ["chromStart", "chromEnd"]
    },
    "tracks": [
      {
        "mark": "rect",
        "color": {
          "field": "Chromosome",
          "type": "nominal",
          "domain": [
            "chr1",
            "chr2",
            "chr3",
            "chr4",
            "chr5",
            "chr6",
            "chr7",
            "chr8",
            "chr9",
            "chr10",
            "chr11",
            "chr12",
            "chr13",
            "chr14",
            "chr15",
            "chr16",
            "chr17",
            "chr18",
            "chr19",
            "chr20",
            "chr21",
            "chr22",
            "chrX",
            "chrY"
          ],
          "range": ["#F6F6F6", "black"]
        },
        "x": {"field": "chromStart", "type": "genomic", "aggregate": "min"},
        "xe": {"field": "chromEnd", "aggregate": "max", "type": "genomic"},
      },
      {
        mark: "brush",
        x: { linkingId: "A" },
        // color: { value: 'blue' },
        stroke: { value: "black" },
        strokeWidth: { value: 2 }
      },
      {
        mark: "brush",
        x: { linkingId: "B" },
        // color: { value: 'red' },
        stroke: { value: "black" },
        strokeWidth: { value: 2 }
      }
    ],
    "stroke": {"value": "gray"},
    "strokeWidth": {"value": 0.5},
    "style": {"outline": "black"},
    width,
    height
  };
}
export function getIdeogram(width, height) {
  return {
    title: "IDEOGRAM",
    "template": "ideogram",
    "data": {
      "url": "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv",
      "type": "csv",
      "chromosomeField": "Chromosome",
      "genomicFields": ["chromStart", "chromEnd"]
    },
    "encoding": {
      "startPosition": {"field": "chromStart"},
      "endPosition": {"field": "chromEnd"},
      "stainBackgroundColor": {"field": "Stain"},
      "stainLabelColor": {"field": "Stain"},
      "name": {"field": "Name"},
      "stainStroke": {"value": "black"}
    },
    width,
    height
  };
}

export const _getIdeogram = (A, B, width, block = true) => {
  if(block) {
    return {
      static: true,
      "tracks": [{
        "data": {
          "url": "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv",
          "type": "csv",
          "chromosomeField": "Chromosome",
          "genomicFields": ["chromStart", "chromEnd"]
        },
        "overlay": [
          {
            "mark": "rect",
            "color": {
              "field": "Chromosome",
              "type": "nominal",
              "domain": [
                "chr1",
                "chr2",
                "chr3",
                "chr4",
                "chr5",
                "chr6",
                "chr7",
                "chr8",
                "chr9",
                "chr10",
                "chr11",
                "chr12",
                "chr13",
                "chr14",
                "chr15",
                "chr16",
                "chr17",
                "chr18",
                "chr19",
                "chr20",
                "chr21",
                "chr22",
                "chrX",
                "chrY"
              ],
              "range": ["#F6F6F6", "gray"]
            },
            "x": {"field": "chromStart", "type": "genomic", "aggregate": "min"},
            "xe": {"field": "chromEnd", "aggregate": "max", "type": "genomic"},
            "strokeWidth": {"value": 2},
            "stroke": {"value": "gray"},
            "visibility": [
              {
                "operation": "greater-than",
                "measure": "zoomLevel",
                "threshold": 100000000,
                "target": "mark",
                "transitionPadding": 100000000
              }
            ]
          },
          {
            mark: "brush",
            x: { linkingId: A }
          },
          {
            mark: "brush",
            x: { linkingId: B }
          }
        ],
        "stroke": {"value": "gray"},
        "strokeWidth": {"value": 0.5},
        "style": {"outline": "black"},
        width,
        "height": 35
      }]};
  }
  return {
    static: true,
    "tracks": [
      {
        "data": {
          "url": "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/cytogenetic_band.csv",
          "type": "csv",
          "chromosomeField": "Chr.",
          "genomicFields": [
            "ISCN_start",
            "ISCN_stop",
            "Basepair_start",
            "Basepair_stop"
          ],
          "quantitativeFields": ["Band", "Density"]
        },
        "overlay": [
          {
            "mark": "text",
            "dataTransform": {
              "filter": [
                {"field": "Stain", "oneOf": ["acen-1", "acen-2"], "not": true}
              ]
            },
            "text": {"field": "Band", "type": "nominal"},
            "color": {"value": "black"},
            "visibility": [
              {
                "operation": "less-than",
                "measure": "width",
                "threshold": "|xe-x|",
                "transitionPadding": 10,
                "target": "mark"
              }
            ],
            "style": {"textStrokeWidth": 0}
          },
          {
            "mark": "rect",
            "dataTransform": {
              "filter": [
                {"field": "Stain", "oneOf": ["acen-1", "acen-2"], "not": true}
              ]
            },
            "color": {
              "field": "Density",
              "type": "nominal",
              "domain": ["", "25", "50", "75", "100"],
              "range": ["white", "#D9D9D9", "#979797", "#636363", "black"]
            }
          },
          {
            "mark": "rect",
            "dataTransform": {
              "filter": [{"field": "Stain", "oneOf": ["gvar"]}]
            },
            "color": {"value": "#A0A0F2"}
          },
          {
            "mark": "triangleRight",
            "dataTransform": {
              "filter": [{"field": "Stain", "oneOf": ["acen-1"]}]
            },
            "color": {"value": "#B40101"}
          },
          {
            "mark": "triangleLeft",
            "dataTransform": {
              "filter": [{"field": "Stain", "oneOf": ["acen-2"]}]
            },
            "color": {"value": "#B40101"}
          },
          {
            mark: "brush",
            x: { linkingId: A }
          },
          {
            mark: "brush",
            x: { linkingId: B }
          }
        ],
        "x": {"field": "Basepair_start", "type": "genomic"},
        "xe": {"field": "Basepair_stop", "type": "genomic"},
        "stroke": {"value": "gray"},
        "strokeWidth": {"value": 0.5},
        width,
        "height": 30
      }
    ]
  };
};