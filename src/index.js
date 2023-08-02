import { Dataspec } from './inputspec.js';
import { checkDuplicates } from "./utils.js";
import { checkMissingAttributes } from "./utils.js";
import { coolerOutput } from "./utils.js";

//Updated variables
import encodeAttributeUpdated from "./s1_en_updated.js";
import getAlignmentUpdated  from "./s2_al_updated.js";
import getLayoutUpdated  from "./s3_ls_updated.js";
import getPartitionUpdated  from "./s4_pt_updated.js";
import getArrangementUpdated  from "./s5_ar_updated.js";

export function getRecommendation(param) {

    let attrMissing = checkMissingAttributes(param);
    if(attrMissing)
    {
        return coolerOutput

    }

    //Validate the input dataspecification to ensure correctness of input data
    const dataspec = Dataspec(param);
    const sequenceInputArrays = dataspec["sequences"];

    //  Updated stagewise processing
    const viewGroups = [];
    const tasksUpdated = dataspec.hasOwnProperty('tasks') ? dataspec["tasks"]: [];
    if (tasksUpdated.length>1) {
        throw 'More than 1 task selection is not allowed';
        }
    const constraints = true;
    for (var i=0;i<sequenceInputArrays.length;i++)
    {
        currentSequence = sequenceInputArrays[i];
        
        //Stage 1: Encoding Selection
        const attributeEncoding = encodeAttributeUpdated(currentSequence,tasksUpdated);

        //Stage 2: Alignment
        const trackAlignment = getAlignmentUpdated(attributeEncoding);

        //Stage 3: Layout
        const getLayout = getLayoutUpdated(trackAlignment,tasksUpdated,dataspec["connectionType"]);

        //Add View Information
        const viewGroupElement = [];
        getLayout.forEach(val=>{
            val["sequenceName"] = currentSequence["sequenceName"];
            viewGroupElement.push(val);
            })

        viewGroups.push(viewGroupElement);
        }

        //Stage 4: Partition
        const partition = getPartitionUpdated(viewGroups,tasksUpdated,dataspec["connectionType"]);

        //Stage 5: Arrangement
        const arrangement = getArrangementUpdated(partition,{connectionType:dataspec["connectionType"]},tasksUpdated);
    
        //Adding additional information to the spec
        arrangement.forEach((val)=>{
            val["geneAnnotation"] = dataspec["geneAnnotation"];
            val["ideogramDisplayed"] = dataspec["ideogramDisplayed"];
            val["tasks"] = tasksUpdated.length>0 ? tasksUpdated[0] : "overview"
        })
        
    //Return the rec non dupicates
    var recommendationSpecNonDuplicatesUpdated = checkDuplicates(Object.values(arrangement))
    // console.log(recommendationSpecNonDuplicatesUpdated);

    return recommendationSpecNonDuplicatesUpdated;

}  