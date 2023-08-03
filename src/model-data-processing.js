import stage1Model from '../model/stage1.json';
import stage3Model from '../model/stage3.json';
import stage5Model from '../model/stage5.json';

//Converting the model to objects
let stage1ModelObj = {};

stage1Model.map(val => {
    stage1ModelObj[val['chart']] = val;
});

let stage3ModelObj = {};
stage3Model.map(val => {
    stage3ModelObj[val['layout']] = val;
});

let stage5ModelObj = {};
stage5Model.map(val => {
    stage5ModelObj[val['arrangement']] = val;
});

//Updated Models
import stage1UpdatedModel from '../model/stage1updated.json';
import stage2UpdatedModel from '../model/stage2updated.json';
import stage3UpdatedModel from '../model/stage3updated.json';
import stage4UpdatedModel from '../model/stage4updated.json';
import stage5UpdatedModel from '../model/stage5updated.json';

let stage1UpdatedModelObj = {};
stage1UpdatedModel.map(val => {
    stage1UpdatedModelObj[val['chart']] = val;
});

let stage2UpdatedModelObj = {};
stage2UpdatedModel.map(val => {
    stage2UpdatedModelObj[val['alignment']] = val;
});

let stage3UpdatedModelObj = {};
stage3UpdatedModel.map(val => {
    stage3UpdatedModelObj[val['layout']] = val;
});

let stage4UpdatedModelObj = {};
stage4UpdatedModel.map(val => {
    stage4UpdatedModelObj[val['partition']] = val;
});

let stage5UpdatedModelObj = {};
stage5UpdatedModel.map(val => {
    stage5UpdatedModelObj[val['arrangement']] = val;
});

export default {
    model1: stage1ModelObj,
    model3: stage3ModelObj,
    model5: stage5ModelObj,
    model1Updated: stage1UpdatedModelObj,
    model2Updated: stage2UpdatedModelObj,
    model3Updated: stage3UpdatedModelObj,
    model4Updated: stage4UpdatedModelObj,
    model5Updated: stage5UpdatedModelObj
};
