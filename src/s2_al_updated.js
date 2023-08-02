import * as globalData from './modelDataProcessing.js';
const model = globalData.model2Updated;
import { productProperties as getProductProperties, computeSimilarity, recommendedProducts } from './utils.js';
// const { GLOBAL_INDEX_DATA } = require("./inputspec.js");

function createInputVector(spec) {
    const inputVectorObject = {};
    const inputArray = [];

    //File Type
    const tracksSameFile = spec.every((val, _, arr) => val['fileName'] === arr[0]['fileName']);
    inputArray.push((inputVectorObject['d_trackssamefile'] = tracksSameFile ? 1 : 0));
    inputArray.push((inputVectorObject['d_tracksdifffile'] = !tracksSameFile ? 1 : 0));

    //Data Type
    const allDataType = spec.map(val => val['encodingName']);
    const allDataTypeSame =
        allDataType.every(val => val.includes('Categorical')) ||
        allDataType.every(val => val.includes('Quantitative')) ||
        allDataType.every(val => val.includes('Text'));
    inputArray.push((inputVectorObject['d_samedatatype'] = allDataTypeSame ? 1 : 0));
    inputArray.push((inputVectorObject['d_differentdatatype'] = !allDataTypeSame ? 1 : 0));

    //Tracks (are pseudo of vars)
    inputArray.push((inputVectorObject['d_singlevar'] = spec.length <= 1 ? 1 : 0));

    //Encoding Type
    const lineChartEncoding = spec.every(val => val['encoding'] === 'lineChart');
    const barChartEncoding = spec.every(
        val => val['encoding'] === 'barChart' || val['encoding'] === 'intervalBarChart'
    );
    inputArray.push((inputVectorObject['s_alllinechart'] = lineChartEncoding ? 1 : 0));
    inputArray.push((inputVectorObject['s_allbarchart'] = barChartEncoding ? 1 : 0));
    inputArray.push((inputVectorObject['s_otherencoding'] = !(lineChartEncoding || barChartEncoding) ? 1 : 0));

    return { inputVectorObject, inputArray };
}

function getAlignmentUpdated(visoptions) {
    // console.log(GLOBAL_INDEX_DATA)

    const vectorKeys = [
        'd_trackssamefile',
        'd_tracksdifffile',
        'd_samedatatype',
        'd_differentdatatype',
        'd_singlevar',
        's_alllinechart',
        's_allbarchart',
        's_otherencoding'
    ];

    const productVector = getProductProperties(model, vectorKeys);
    const output = [];

    visoptions.forEach(element => {
        const inputVectorObject = createInputVector(element);
        // console.log(inputVectorObject,productVector);
        const similarityScores = computeSimilarity(inputVectorObject, productVector);
        // console.log(similarityScores);
        const recommendation = recommendedProducts(similarityScores);
        var tempAttributeStorage = {};
        recommendation.forEach(val => {
            tempAttributeStorage = {
                trackAlignment: val,
                trackAlignmentPrediction: similarityScores[val],
                tracks: element
            };
        });
        output.push(tempAttributeStorage);
    });

    return output;
}

export default getAlignmentUpdated;
