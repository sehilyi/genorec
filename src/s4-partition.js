import globalData from './model-data-processing.js';
import {
    productProperties as getProductProperties,
    recommendedProducts,
    computeSimilarity,
    cartesian
} from './utils.js';

const model = globalData.model4Updated;

function createInputVector(specs, tasks, network) {
    const inputVectorObject = {};
    const inputArray = [];

    //Tracks and Views
    inputArray.push(
        (inputVectorObject['d_multivars'] = specs.some(val => {
            return val['tracks'].length > 1;
        })
            ? 1
            : 0)
    );
    inputArray.push((inputVectorObject['d_multisequences'] = specs.length > 1 ? 1 : 0));

    //Connection
    const connection = [];
    connection.push(network !== 'none');
    specs.forEach(spec => {
        connection.push(
            spec['tracks'].some(track => {
                return track['interconnectionType'] !== 'none';
            })
        );
    });
    inputArray.push(
        (inputVectorObject['d_connection'] = connection.some(val => {
            return val;
        })
            ? 1
            : 0)
    );

    //Tasks
    inputArray.push((inputVectorObject['t_overview'] = tasks.includes('overview') ? 1 : 0));
    inputArray.push((inputVectorObject['t_identify'] = tasks.includes('singleROI') ? 1 : 0));
    inputArray.push((inputVectorObject['t_comparerois'] = tasks.includes('compareMultipleROI') ? 1 : 0));

    //Layout
    let allLayouts = specs.map(view => {
        if (view.tracks) {
            const layouts = view['tracks'].map(track => {
                return track['layout'];
            });
            return layouts;
        } else {
            return [];
        }
    });
    allLayouts = allLayouts.flat(1);
    inputArray.push((inputVectorObject['s_circularlayout'] = allLayouts.includes('circular') ? 1 : 0));
    inputArray.push((inputVectorObject['s_linearlayout'] = allLayouts.includes('linear') ? 1 : 0));

    // console.log(inputVectorObject)
    return { inputVectorObject, inputArray };
}

export default function partition(input, tasks, network) {
    const vectorKeys = [
        'd_multivars',
        'd_multisequences',
        'd_connection',
        't_overview',
        't_identify',
        't_comparerois',
        's_circularlayout',
        's_linearlayout'
    ];
    const productVector = getProductProperties(model, vectorKeys);
    const output = [];

    const allVisOptions = cartesian(input);
    allVisOptions.forEach(views => {
        const inputVectorObject = createInputVector(views, tasks, network);
        const similarityScores = computeSimilarity(inputVectorObject, productVector);
        const recommendation = recommendedProducts(similarityScores);
        recommendation.forEach(val => {
            const viewPartition = val;
            const partitionPredictionScore = similarityScores[val];
            output.push({ viewPartition, partitionPredictionScore, views });
        });
    });

    return output;
}