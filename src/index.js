import { Dataspec } from './input-spec.js';
import { checkDuplicates } from './utils.js';
import { checkMissingAttributes } from './utils.js';
import { coolerOutput } from './utils.js';

//Updated variables
import encodeAttributeUpdated from './s1-encoding.js';
import getAlignmentUpdated from './s2-alignment.js';
import getLayoutUpdated from './s3-layout.js';
import getPartitionUpdated from './s4-partition.js';
import getArrangementUpdated from './s5-arrangement.js';

export function getRecommendation(param) {
    let attrMissing = checkMissingAttributes(param);
    if (attrMissing) {
        return coolerOutput;
    }

    //Validate the input dataspecification to ensure correctness of input data
    const dataspec = Dataspec(param);
    const sequenceInputArrays = dataspec['sequences'];

    //  Updated stagewise processing
    const viewGroups = [];
    const tasksUpdated = dataspec['tasks'] ?? [];
    if (tasksUpdated.length > 1) {
        throw 'More than 1 task selection is not allowed';
    }
    // const constraints = true;
    for (var i = 0; i < sequenceInputArrays.length; i++) {
        const currentSequence = sequenceInputArrays[i];

        //Stage 1: Encoding Selection
        const attributeEncoding = encodeAttributeUpdated(currentSequence, tasksUpdated);

        //Stage 2: Alignment
        const trackAlignment = getAlignmentUpdated(attributeEncoding);

        //Stage 3: Layout
        const getLayout = getLayoutUpdated(trackAlignment, tasksUpdated, dataspec['connectionType']);

        //Add View Information
        const viewGroupElement = [];
        getLayout.forEach(val => {
            val['sequenceName'] = currentSequence['sequenceName'];
            viewGroupElement.push(val);
        });

        viewGroups.push(viewGroupElement);
    }

    //Stage 4: Partition
    const partition = getPartitionUpdated(viewGroups, tasksUpdated, dataspec['connectionType']);

    //Stage 5: Arrangement
    const arrangement = getArrangementUpdated(partition, { connectionType: dataspec['connectionType'] }, tasksUpdated);

    //Adding additional information to the spec
    arrangement.forEach(val => {
        val['geneAnnotation'] = dataspec['geneAnnotation'];
        val['ideogramDisplayed'] = dataspec['ideogramDisplayed'];
        val['tasks'] = tasksUpdated.length > 0 ? tasksUpdated[0] : 'overview';
    });

    //Return the rec non dupicates
    var recommendationSpecNonDuplicatesUpdated = checkDuplicates(Object.values(arrangement));
    // console.log(recommendationSpecNonDuplicatesUpdated);

    return recommendationSpecNonDuplicatesUpdated;
}
