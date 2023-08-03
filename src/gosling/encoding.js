import { getSampleColor } from "./color";
import { IS_DEBUG_RECOMMENDATION_PANEL } from "./convert";

export const EXAMPLE_DATASETS = {
  multivec: "https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ",
  fasta: "https://resgen.io/api/v1/tileset_info/?d=WipsnEDMStahGPpRfH9adA",
  geneAnnotation: "https://higlass.io/api/v1/tileset_info/?d=OHJakQICQD6gTD7skx4EWA",
  interaction: "https://resgen.io/api/v1/tileset_info/?d=JzccFAJUQEiz-0188xaWZg",
  clinvar: "https://cgap-higlass.com/api/v1/tileset_info/?d=clinvar_20200824_hg38",
  region: "https://resgen.io/api/v1/gt/paper-data/tileset_info/?d=SYZ89snRRv2YcxRwG_25_Q",
  region2: "https://resgen.io/api/v1/gt/paper-data/tileset_info/?d=HT4KNWdTQs2iN477vqDKWg",
  // https://github.com/hms-dbmi/cistrome-explorer/blob/b12238aeadbaf4a41f5445c32dbe3d6518d6fd1d/src/viewconfigs/horizontal-multivec-1.js#L145
  gwas: "https://server.gosling-lang.org/api/v1/tileset_info/?d=gwas-beddb"
};

/**
 * This generates good looking data based on granularity and availability.
 * 
 * @param {*} i 
 * @param {*} granularity 
 * @param {*} availability 
 */
export const getMultivecData = (/* i = 0, granularity, availability */) => {
  const index = Number.parseInt(Math.random() * 100); // !! TODO: Use consistent index?
  return {
    data: {
      url: EXAMPLE_DATASETS.multivec,
      type: "multivec",
      row: "sample",
      column: "position",
      value: "peak",
      categories: (Array.from(Array(index + 1).keys()).map(d => `${d}`)),
      binSize: 4 // granularity === "segment" ? 4 : 2
    },
    dataTransform: [
      { type: "filter", field: "sample", oneOf: [`${index}`], not: false }
    ]
    // (
    // availability === "sparse" ? [
    // 	{ field: "sample", oneOf: [i + ""], not: false },
    // 	{ field: "peak", inRange: [0.0001, 0.0008] }
    // ] : [
						
    // ]
    // )
  };
};

export const getGWASData = () => {
  return {
    "data": {
      "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gwas-beddb",
      "type": "beddb",
      "genomicFields": [
        {"index": 1, "name": "start"},
        {"index": 2, "name": "end"}
      ],
      "valueFields": [
        {"index": 3, "name": "pubmedid", "type": "nominal"},
        {"index": 4, "name": "date", "type": "nominal"},
        {"index": 5, "name": "link", "type": "nominal"},
        {"index": 6, "name": "pvalue", "type": "quantitative"},
        {"index": 8, "name": "disease", "type": "nominal"},
        {
          "index": 9,
          "name": "pvalue_log",
          "type": "quantitative"
        },
        {"index": 10, "name": "pvalue_txt", "type": "nominal"}
      ]
    }
  };
};

export function encodingToTrackSparse(encoding, config) {
  const { 
    title, 
    width, 
    index = 0
  } = config;

  const trackBase = {
    title,
    style: { outlineWidth: 1 },
    width,
    height: 100
  };

  switch(encoding) {
  case "lineChart":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getGWASData(index))),
      alignment: "overlay",
      tracks: [
        { mark: "line" },
        { mark: "point", size: { value: 2 } },
      ],
      x: { field: "start", type: "genomic" },
      y: { field: "pvalue", type: "quantitative", axis: "right", grid: true },
      color: { value: getSampleColor(index) },
      size: { value: 1 },
      opacity: { value: 0.8 }
    };
  case "dotPlot":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getGWASData(index))),
      mark: "point", 
      x: { field: "start", type: "genomic" },
      xe: { field: "end", type: "genomic" },
      y: { field: "pvalue", type: "quantitative", axis: "right", grid: true },
      color: { value: getSampleColor(index) },
      size: { value: 4 },
      opacity: { value: 0.8 }
    };
  case "barChart":
  case "intervalBarChart":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getGWASData(index))),
      mark: "bar",
      x: { field: "start", type: "genomic" },
      // xe: { field: "end", type: "genomic" },
      y: { field: "pvalue", type: "quantitative", axis: "right", grid: true },
      color: { value: getSampleColor(index) },
      stroke: { value: getSampleColor(index) },
      strokeWidth: { value: 0.5 },
      opacity: { value: 0.8 },
      size: {value: 3},
    };
  case "barChartCN":
  case "intervalBarChartCN":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getGWASData(index))),
      dataTransform: [
        {type: "filter", field: "disease", oneOf: ["asthema", "Breast cancer", "Hematocrit", "Plateletcrit"]},
        {type: "replace", field: "disease", newField: "c", replace: [
          {from: "asthema", to: "A"}, 
          {from: "Breast cancer", to: "B"},
          {from: "Hematocrit", to: "C"},
          {from: "Plateletcrit", to: "D"}]
        },
      ],
      mark: "rect",
      x: { "field": "start", "type": "genomic" },
      // xe: { "field": "end", "type": "genomic" },
      stroke: { "field": "c", "type": "nominal", domain: ["A", "B", "C", "D"] },
      color: { "field": "c", "type": "nominal", legend: true, domain: ["A", "B", "C", "D"]},
      strokeWidth: { value: 4 },
    };
  case "heatmap":
  case "intervalHeatmap":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getGWASData(index))),
      mark: "rect",
      x: { field: "start", type: "genomic" },
      // xe: { field: "end", type: "genomic" },
      stroke: { field: "pvalue", type: "quantitative", range: "grey"},
      color: { field: "pvalue", type: "quantitative", legend: true, range: "grey" },
      strokeWidth: { value: 4 },
      // opacity: { value: 0.8 }
    };
  case "link":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      data: {
        url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/circos-segdup-edited.txt",
        type: "csv",
        chromosomeField: "c2",
        genomicFields: ["s1", "e1", "s2", "e2"]
      },
      mark: "withinLink",
      x: { field: "s1", type: "genomic" },
      xe: { field: "e1", type: "genomic" },
      x1: { field: "s2", type: "genomic" },
      x1e: { field: "e2", type: "genomic" },
      color: { value: "none" },
      stroke: { value: "gray" },
      opacity: { value: 0.3 }
    };
  case "matrix":
    // custom encoding key for dense-orthogonal interaction
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      data: {
        "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=hffc6-microc-hg38",
        "type": "matrix"
      },
      mark: "rect",
      x: { "field": "position1", "type": "genomic", "axis": "none" },
      y: { "field": "position2", "type": "genomic", "axis": "none" },
      color: { "field": "value", "type": "quantitative", "range": "warm" },
      width,
      height: width
    };
  case "annotation":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      "data": {
        "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
        "type": "beddb",
        "genomicFields": [
          { "index": 1, "name": "start" },
          { "index": 2, "name": "end" }
        ],
        "valueFields": [
          { "index": 5, "name": "strand", "type": "nominal" },
          { "index": 3, "name": "name", "type": "nominal" },
          { "index": 4, "name": "4", "type": "nominal" },
          { "index": 6, "name": "6", "type": "nominal" },
          { "index": 7, "name": "7", "type": "nominal" },
          { "index": 8, "name": "8", "type": "nominal" },
          { "index": 9, "name": "9", "type": "nominal" },
          { "index": 10, "name": "10", "type": "nominal" },
          { "index": 11, "name": "11", "type": "nominal" },
        ],
        "exonIntervalFields": [
          { "index": 12, "name": "start" },
          { "index": 13, "name": "end" }
        ]
      },
      "dataTransform": [
        { type: "filter", "field": "type", "oneOf": ["gene"] },
        { type: "filter", "field": "strand", "oneOf": ["+"] }
      ],
      mark: "text",
      text: { field: "name", "type": "nominal" }, // lets always use the name
      // text: { field: ["name", "strand", "4", "6", "7", "8", "9", "10", "11"][i % 4], "type": "nominal" },
      x: { "field": "start", "type": "genomic" },
      xe: { "field": "end", "type": "genomic" },
      displacement: {"type": "pile", "padding": 30},
      color: { value: "gray" },
      opacity: { "value": 0.8 }
    };
  default:
    if(IS_DEBUG_RECOMMENDATION_PANEL) console.log(`%c Unsupported Encoding: ${encoding}`, "color: orange; font-size: 24px");
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getMultivecData(index))),
      mark: "rect",
      x: { field: "start", type: "genomic" },
      xe: { field: "end", type: "genomic" },
      color: { field: "peak", type: "quantitative", range: "grey", legend: true },
      opacity: { value: 0.8 }
    };
  }
}
export function encodingToTrackContinuous(encoding, config) {
  const { 
    title, 
    width, 
    index = 0,
  } = config;

  const trackBase = {
    title,
    style: { outlineWidth: 1 },
    width,
    height: 100
  };

  switch(encoding) {
  case "lineChart":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getMultivecData(index))),
      alignment: "overlay",
      tracks: [
        { mark: "line" },
        { mark: "point", size: { value: 2 } },
      ],
      x: { field: "position", type: "genomic" },
      y: { field: "peak", type: "quantitative", axis: "right", grid: true },
      color: { value: getSampleColor(index) },
      size: { value: 1 },
      opacity: { value: 0.8 }
    };
  case "dotPlot":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getMultivecData(index))),
      mark: "point", 
      x: { field: "position", type: "genomic" },
      y: { field: "peak", type: "quantitative", axis: "right", grid: true },
      color: { value: getSampleColor(index) },
      size: { value: 4 },
      opacity: { value: 0.8 }
    };
  case "barChart":
  case "intervalBarChart":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getMultivecData(index))),
      mark: "bar",
      x: { field: "start", type: "genomic" },
      xe: { field: "end", type: "genomic" },
      y: { field: "peak", type: "quantitative", axis: "right", grid: true },
      color: { value: getSampleColor(index) },
      strokeWidth: { value: 0.5 },
      opacity: { value: 0.8 }
    };
  case "barChartCN":
  case "intervalBarChartCN":
    console.warn("intervalBarChartCN with coutiguous feature should not be selected.");
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      "data": {
        "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
        "type": "multivec",
        "row": "sample",
        "column": "position",
        "value": "peak",
        "categories": ["A", "B", "C", "D"],
        "binSize": 4
      },
      mark: "rect",
      x: { field: "start", type: "genomic" },
      color: { field: "sample", type: "nominal", legend: true },
      stroke: { field: "sample", type: "nominal", legend: true },
      strokeWidth: { value: 4 },
    };
    // return {
    //   ...JSON.parse(JSON.stringify(trackBase)),
    //   "data": {
    //     "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
    //     "type": "beddb",
    //     "genomicFields": [
    //       { "index": 1, "name": "start" },
    //       { "index": 2, "name": "end" }
    //     ],
    //     "valueFields": [
    //       { "index": 5, "name": "strand", "type": "nominal" },
    //       { "index": 3, "name": "name", "type": "nominal" },
    //       { "index": 4, "name": "4", "type": "nominal" },
    //       { "index": 6, "name": "6", "type": "nominal" },
    //       { "index": 7, "name": "7", "type": "nominal" },
    //       { "index": 8, "name": "8", "type": "nominal" },
    //       { "index": 9, "name": "9", "type": "nominal" },
    //       { "index": 10, "name": "10", "type": "nominal" },
    //       { "index": 11, "name": "11", "type": "nominal" },
    //     ],
    //     "exonIntervalFields": [
    //       { "index": 12, "name": "start" },
    //       { "index": 13, "name": "end" }
    //     ]
    //   },
    //   "dataTransform": [
    //     { type: "filter", "field": "type", "oneOf": ["gene"] },
    //     { type: "filter", "field": "strand", "oneOf": ["+"] }
    //   ],
    //   mark: "rect",
    //   x: { "field": "start", "type": "genomic" },
    //   xe: { "field": "end", "type": "genomic" },
    //   stroke: { "field": "8", "type": "nominal" },
    //   strokeWidth: { value: 4 },
    //   color: { "field": "8", "type": "nominal", legend: true, domain: ["protein-coding", "ncRNA", "snRNA"] },
    // };
  case "heatmap":
  case "intervalHeatmap":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getMultivecData(index))),
      mark: "rect",
      x: { field: "start", type: "genomic" },
      xe: { field: "end", type: "genomic" },
      color: { field: "peak", type: "quantitative", range: "grey", legend: true },
      opacity: { value: 0.8 }
    };
  case "link":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      data: {
        url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/circos-segdup-edited.txt",
        type: "csv",
        chromosomeField: "c2",
        genomicFields: ["s1", "e1", "s2", "e2"]
      },
      mark: "withinLink",
      x: { field: "s1", type: "genomic" },
      xe: { field: "e1", type: "genomic" },
      x1: { field: "s2", type: "genomic" },
      x1e: { field: "e2", type: "genomic" },
      color: { value: "none" },
      stroke: { value: "gray" },
      opacity: { value: 0.3 }
    };
  case "matrix":
    // custom encoding key for dense-orthogonal interaction
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      data: {
        "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=hffc6-microc-hg38",
        "type": "matrix"
      },
      mark: "rect",
      x: { "field": "position1", "type": "genomic", "axis": "none" },
      y: { "field": "position2", "type": "genomic", "axis": "none" },
      color: { "field": "value", "type": "quantitative", "range": "warm" },
      width,
      height: width
    };
  case "annotation":
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      "data": {
        "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
        "type": "beddb",
        "genomicFields": [
          { "index": 1, "name": "start" },
          { "index": 2, "name": "end" }
        ],
        "valueFields": [
          { "index": 5, "name": "strand", "type": "nominal" },
          { "index": 3, "name": "name", "type": "nominal" },
          { "index": 4, "name": "4", "type": "nominal" },
          { "index": 6, "name": "6", "type": "nominal" },
          { "index": 7, "name": "7", "type": "nominal" },
          { "index": 8, "name": "8", "type": "nominal" },
          { "index": 9, "name": "9", "type": "nominal" },
          { "index": 10, "name": "10", "type": "nominal" },
          { "index": 11, "name": "11", "type": "nominal" },
        ],
        "exonIntervalFields": [
          { "index": 12, "name": "start" },
          { "index": 13, "name": "end" }
        ]
      },
      "dataTransform": [
        { type: "filter", "field": "type", "oneOf": ["gene"] },
        { type: "filter", "field": "strand", "oneOf": ["+"] }
      ],
      mark: "text",
      text: { field: "name", "type": "nominal" }, // lets always use the name
      // text: { field: ["name", "strand", "4", "6", "7", "8", "9", "10", "11"][i % 4], "type": "nominal" },
      x: { "field": "start", "type": "genomic" },
      xe: { "field": "end", "type": "genomic" },
      displacement: {"type": "pile", "padding": 30},
      color: { value: "gray" },
      opacity: { "value": 0.8 }
    };
  default:
    if(IS_DEBUG_RECOMMENDATION_PANEL) console.log(`%c Unsupported Encoding: ${encoding}`, "color: orange; font-size: 24px");
    return {
      ...JSON.parse(JSON.stringify(trackBase)),
      ...JSON.parse(JSON.stringify(getMultivecData(index))),
      mark: "rect",
      x: { field: "start", type: "genomic" },
      xe: { field: "end", type: "genomic" },
      color: { field: "peak", type: "quantitative", range: "grey", legend: true },
      opacity: { value: 0.8 }
    };
  }
}
export function encodingToTrack(encoding, config) {
  if(config.density === "sparse") return encodingToTrackSparse(encoding, config);
  else return encodingToTrackContinuous(encoding, config);
}

// const height = 40;
// export function _encodingToTrack(
// 	encoding,
// 	width,
// 	i = 0,
// 	// showAxis = false,
// 	title = undefined,
// 	// linkingID = undefined,
// 	availability = "sparse",
// 	granularity = "point",
// 	cI = 0
// ) {
// 	const base = {
// 		title,
// 		style: { outlineWidth: 1 }, // outline: 'black', outlineWidth: 0.5
// 		width,
// 		height
// 	};
// 	// const axis = showAxis ? "bottom" : undefined;
// 	// const domain = [undefined, { chromosome: "1" }][1];
// 	switch (encoding) {
// 	case "linechart":
// 		return {
// 			...base,
// 			...getMultivecData(i, granularity, availability),
// 			mark: "line",
// 			x: { field: "position", type: "genomic" },
// 			y: { field: "peak", type: "quantitative" },
// 			color: { value: getSampleColor(cI) }
// 		};
// 	case "barchart":
// 	case "intervalBarchart":
// 		return {
// 			...base,
// 			...getMultivecData(i, granularity, availability),
// 			mark: "bar",
// 			x: { field: "start", type: "genomic" },
// 			xe: { field: "end", type: "genomic" },
// 			y: { field: "peak", type: "quantitative" },
// 			color: { value: getSampleColor(cI) },
// 			stroke: { value: "white" },
// 			strokeWidth: { value: 0.5 },
// 		};
// 	case "heatmap":
// 	case "intervalHeatmap":
// 		return {
// 			...base,
// 			...getMultivecData(i, granularity, availability),
// 			mark: "rect",
// 			x: { field: "start", type: "genomic" },
// 			xe: { field: "end", type: "genomic" },
// 			color: { field: "peak", type: "quantitative" },
// 		};
// 	case "heatmap.barchart":
// 	case "barchart.heatmap":
// 	case "intervalHeatmap.intervalBarchart":
// 	case "intervalBarchart.intervalHeatmap":
// 		return {
// 			...base,
// 			...getMultivecData(i, granularity, availability),
// 			mark: "bar",
// 			x: { field: "start", type: "genomic" },
// 			xe: { field: "end", type: "genomic" },
// 			y: { field: "peak", type: "quantitative" },
// 			color: { field: "peak", type: "quantitative" },
// 			stroke: { value: "white" },
// 			strokeWidth: { value: 0.5 },
// 		};
// 	case "barchartCN":
// 	case "intervalBarchartCN":
// 		return {
// 			...base,
// 			...getMultivecData(i, granularity, availability),
// 			mark: "rect",
// 			x: { field: "start", type: "genomic" },
// 			xe: { field: "end", type: "genomic" },
// 			color: { field: "start", type: "nominal" },
// 			stroke: { value: "white" },
// 			strokeWidth: { value: 0.5 },
// 		};
// 	case "intervalBarchart.intervalBarchartCN":
// 	case "intervalBarchartCN.intervalBarchart":
// 	case "barchartCN.barchart":
// 	case "barchart.barchartCN":
// 		return {
// 			...base,
// 			...getMultivecData(i, granularity, availability),
// 			mark: "bar",
// 			x: { field: "position", type: "genomic" },
// 			y: { field: "peak", type: "quantitative" },
// 			opacity: { value: 0.8 },
// 			stroke: { value: "white" },
// 			strokeWidth: { value: 0.3 },
// 			color: { field: "start", type: "nominal" },
// 		};
// 	case "heatmap.dotplot":
// 	case "dotplot.heatmap":
// 		return {
// 			...base,
// 			...getMultivecData(i, granularity, availability),
// 			mark: "point",
// 			x: { field: "position", type: "genomic" },
// 			y: { field: "peak", type: "quantitative" },
// 			size: { value: 4 },
// 			opacity: { value: 0.8 },
// 			stroke: { value: "white" },
// 			strokeWidth: { value: 0.3 },
// 			color: { field: "peak", type: "quantitative" },
// 		};
// 	case "dotplot":
// 		return {
// 			...base,
// 			...getMultivecData(i, granularity, availability),
// 			mark: "point",
// 			x: { field: "position", type: "genomic" },
// 			y: { field: "peak", type: "quantitative" },
// 			size: { value: 4 },
// 			opacity: { value: 0.8 },
// 			stroke: { value: "white" },
// 			strokeWidth: { value: 0.3 },
// 			color: { value: getSampleColor(cI) }
// 		};
// 	case "dotplot.barchartCN":
// 	case "barchartCN.dotplot":
// 		return {
// 			...base,
// 			...getMultivecData(i, granularity, availability),
// 			mark: "point",
// 			x: { field: "position", type: "genomic" },
// 			size: { value: 4 },
// 			opacity: { value: 0.8 },
// 			stroke: { value: "white" },
// 			strokeWidth: { value: 0.3 },
// 			color: { field: "start", type: "nominal" },
// 		};
// 	case "link":
// 		return {
// 			...base,
// 			data: {
// 				url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/circos-segdup-edited.txt",
// 				type: "csv",
// 				chromosomeField: "c2",
// 				genomicFields: ["s1", "e1", "s2", "e2"]
// 			},
// 			mark: "link",
// 			x: { field: "s1", type: "genomic" },
// 			xe: { field: "e1", type: "genomic" },
// 			x1: { field: "s2", type: "genomic" },
// 			x1e: { field: "e2", type: "genomic" },
// 			color: { value: "none" },
// 			stroke: { value: "gray" },
// 			opacity: { value: 0.3 }
// 		};
// 	case "annotation":
// 		return {
// 			...base,
// 			"data": {
// 				"url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
// 				"type": "beddb",
// 				"genomicFields": [
// 					{ "index": 1, "name": "start" },
// 					{ "index": 2, "name": "end" }
// 				],
// 				"valueFields": [
// 					{ "index": 5, "name": "strand", "type": "nominal" },
// 					{ "index": 3, "name": "name", "type": "nominal" },
// 					{ "index": 4, "name": "4", "type": "nominal" },
// 					{ "index": 6, "name": "6", "type": "nominal" },
// 					{ "index": 7, "name": "7", "type": "nominal" },
// 					{ "index": 8, "name": "8", "type": "nominal" },
// 					{ "index": 9, "name": "9", "type": "nominal" },
// 					{ "index": 10, "name": "10", "type": "nominal" },
// 					{ "index": 11, "name": "11", "type": "nominal" },
// 				],
// 				"exonIntervalFields": [
// 					{ "index": 12, "name": "start" },
// 					{ "index": 13, "name": "end" }
// 				]
// 			},
// 			"dataTransform": {
// 				"filter": [
// 					{ "field": "type", "oneOf": ["gene"] },
// 					{ "field": "strand", "oneOf": ["+"] }
// 				]
// 			},
// 			"mark": "text",
// 			text: { field: ["name", "strand", "4", "6", "7", "8", "9", "10", "11"][i % 4], "type": "nominal" },
// 			"x": { "field": "start", "type": "genomic" },
// 			"xe": { "field": "end", "type": "genomic" },
// 			"color": {
// 				"value": "gray"
// 			},
// 			"opacity": { "value": 0.8 }
// 		};
// 	case "matrix":
// 		return {
// 			...base,
// 			title: "matrix",
// 			style: { outline: "black", outlineWidth: 2 },
// 			static: true,
// 			"data": {
// 				"url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
// 				"type": "multivec",
// 				"row": "sample",
// 				"column": "position",
// 				"value": "peak",
// 				"categories": [
// 					"1", "2", "3", "4", "5",
// 					"11", "12", "13", "14", "15",
// 					"21", "22", "23", "24", "25",
// 					"31", "32", "33", "34", "35",
// 					"41", "42", "43", "44", "45"
// 				],
// 				"binSize": 16
// 			},
// 			"mark": "rect",
// 			"x": { "field": "start", "type": "genomic", "axis": "none" },
// 			"xe": { "field": "end", "type": "genomic" },
// 			"row": { "field": "sample", "type": "nominal" },
// 			"color": { "field": "peak", "type": "quantitative" },
// 			height: width
// 		};
// 	default:
// 		console.error("Unexpected encoding:", encoding);
// 		return {
// 			...base,
// 			title: encoding,
// 			height: width,
// 			data: {
// 				url: EXAMPLE_DATASETS.multivec,
// 				type: "multivec",
// 				row: "sample",
// 				column: "position",
// 				value: "peak",
// 				categories: ["-"],
// 				binSize: 18
// 			},
// 			mark: "bar",
// 			style: { background: "lightgray", outline: 0.5 }
// 		};
// 	}
// }