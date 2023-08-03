// Reference: https://github.com/mljs/distance#ml-distance
import { similarity as mlSim } from 'ml-distance';
const SIMILARITY_METRIC = 'cosine';

export function productProperties(model, vectorKeys) {
    var getProductProperties = [];
    var productKeys = Object.keys(model);

    productKeys.forEach(currentProduct => {
        var tempgetProductProperties = {};

        tempgetProductProperties[currentProduct] = [];
        vectorKeys.map(val => {
            const value = +model[currentProduct][val];
            tempgetProductProperties[currentProduct].push(value);
        });

        getProductProperties.push(tempgetProductProperties);
    });
    return getProductProperties;
}

// Description: Calculate the recommendation
// Input: product and input vector
// Output: similarity score corresponding to each output
export function computeSimilarity(inputVectorObject, productVector) {
    var inpVec = inputVectorObject['inputArray'];
    var resultSimilarity = {};
    for (var i = 0; i < productVector.length; i++) {
        var obj = productVector[i];
        var key = Object.keys(obj)[0];
        var proVec = obj[key];
        var similarity = mlSim[SIMILARITY_METRIC](inpVec, proVec);
        resultSimilarity[key] = similarity;
    }
    return resultSimilarity;
}

//Input: An object with vis techniques as keys and similarity scores. Additionally, key for the similarity metric to use.
//Output: Array of recommendation. The array allows for mutiple output in the cases where the scores are exactly similar.
export function recommendedProducts(similarityScores) {
    let arr = Object.values(similarityScores);

    let max = Math.max(...arr);
    var recommendedProducts = [];
    // var secondHighest = arr.sort(function (a, b) {
    //     return b - a;
    // })[1];

    Object.keys(similarityScores).map(val => {
        if (similarityScores[val] == max) {
            recommendedProducts.push(val);
        }
    });

    // //To add more recommendation objects
    // if(recommendedProducts.length==1){
    //   Object.keys(similarityScores).map((val) => {
    //     if(similarityScores[val] == secondHighest && secondHighest>0.50) {recommendedProducts.push(val) }
    //   })

    // }

    return recommendedProducts;
}

//Description: Test function to evaluate combinations of attributes
//Input: Array of arrays that have to be combined
//Output: All possible combinations of the arrays
export function cartesian(args) {
    var r = [],
        max = args.length - 1;
    function helper(arr, i) {
        for (var j = 0, l = args[i].length; j < l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i == max) r.push(a);
            else helper(a, i + 1);
        }
    }
    helper([], 0);
    return r;
}

//Input: Object of features. Each feature consists of an array of elements.
//Output: Merge by performing a cartesian product.
//Output Schema: {'visid':[a:{information},b,c], 'visid2':[a,b]}
//Information: {featureid:[] ,encoding/s:[], layoutrecommendation}
export function getVisOptions(tracks) {
    var features = Object.keys(tracks);
    var trackPossibilitiesArray = features.map((val, i) => {
        var index = i;
        var localTrackPossilities = tracks[val]['trackPossibilities'];
        localTrackPossilities.every(val1 => {
            return (val1['featureId'] = 'feature_' + index);
        });
        return localTrackPossilities;
    });

    var visOptions = cartesian(trackPossibilitiesArray);

    // if(visOptions.every(val => val.length==1)){
    //   let tempVisOptions = [...visOptions]
    //   let predictedLayout = uniformizeSingleFeaturePrediction(tempVisOptions)
    // }

    var returnVisOptions = {};

    for (var j = 0; j < visOptions.length; j++) {
        returnVisOptions['vis_' + j] = arrayToObject(visOptions[j], 'featureId');

        // let predictedLayout = uniformizeLayoutPrediction(JSON.stringify(visOptions[j]))
        // returnVisOptions['vis_'+j] = arrayToObject(predictedLayout,"featureId")
    }

    return returnVisOptions;
}

//Description -> Assigns all features in a vis the same layout
// Function uses prediction score to find the more prominent layout and then uses for the assignment
// function uniformizeLayoutPrediction(vis) {
//     let testVis = JSON.parse(vis);
//     var predictionScore = 0;
//     var layout;

//     testVis.map(val => {
//         if (val['predictionScore'] >= predictionScore) layout = val['layoutRecommendation'];
//     });
//     testVis.map(val => {
//         val['layoutRecommendation'] = layout;
//     });
//     return testVis;
// }

//
// function uniformizeSingleFeaturePrediction(vis) {
//     let testVis = vis;
//     var predictionScore = 0;
//     var layout;

//     testVis.map(val => {
//         if (val[0]['predictionScore'] >= predictionScore) layout = val[0]['layoutRecommendation'];
//     });
//     testVis.map(val => {
//         val[0]['layoutRecommendation'] = layout;
//     });
//     return testVis;
// }

//Description -> Converts an arra [id:val, key: val] to id:{id,val}
const arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj;
    }, {});

export function mode(array) {
    if (array.length == 0) return null;
    var modeMap = {};
    var maxEl = array[0],
        maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (modeMap[el] == null) modeMap[el] = 1;
        else modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

//Check duplicate recommendation spec string
export function checkDuplicates(inputArray) {
    // var output = {};
    for (let i = 0; i < inputArray.length - 1; i++) {
        for (let j = i + 1; j < inputArray.length; j++) {
            // console.log(inputArray[i])
            if (JSON.stringify(inputArray[i]) === JSON.stringify(inputArray[j])) {
                inputArray.splice(j, 1);
            }
        }
    }

    // inputArray.forEach((element,index) => {
    //   output["recommendation_"+index] = element
    // });

    return inputArray;
}

//Test if no attributes are provided in the input data
export function checkMissingAttributes(input) {
    return input['sequences'].some(sequence => {
        return sequence['features'].length === 0;
    });
}

export const coolerOutput = [
    {
        viewPartition: 'contiguous',
        partitionPredictionScore: 0.5345224838248487,
        views: [],
        viewArrangement: 'orthogonal',
        viewArrangementPredictionScore: 0.5773502691896257,
        viewConnectionType: 'dense',
        geneAnnotation: true,
        ideogramDisplayed: true,
        tasks: []
    }
];
