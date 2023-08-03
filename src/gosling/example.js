
export const SIMPLE_GOSLING_SPEC = (width, layout) => {
  return {
    style: { enableSmoothPath: true, background: "#FAFAFA", outline: "black", outlineWidth: 1 },
    static: false,
    layout,
    centerRadius: 0.7,
    "tracks": [
      {
        alignment: "overlay",
        "data": {
          "url": "https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ",
          "type": "multivec",
          "row": "sample",
          "column": "position",
          "value": "peak",
          "categories": ["sample 1"],
          binSize: 2
        },
        tracks: [
          { mark: "line" },
          { mark: "point", size: { value: 2 } },
        ],
        x: { field: "position", type: "genomic" },
        y: { field: "peak", type: "quantitative", grid: true, axis: "right" },
        color: { value: "steelblue" },
        opacity: { value: 1 },
        width,
        height: 100
      }
    ]
  };
};