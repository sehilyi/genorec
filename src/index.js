import { Dataspec } from './input-spec.js';
import encoding from './s1-encoding.js';
import alignment from './s2-alignment.js';
import layout from './s3-layout.js';
import partition from './s4-partition.js';
import arrangement from './s5-arrangement.js';
import { checkDuplicates, checkMissingAttributes, coolerOutput } from './utils.js';

export function recommend(param) {
    const attrMissing = checkMissingAttributes(param);

    if (attrMissing) {
        return coolerOutput;
    }

    // Validate the input dataspecification to ensure correctness of input data
    const dataspec = Dataspec(param);
    const sequenceInputArrays = dataspec['sequences'];

    // Updated stagewise processing
    const viewGroups = [];
    const tasksUpdated = dataspec['tasks'] ?? [];
    if (tasksUpdated.length > 1) {
        throw 'More than 1 task selection is not allowed';
    }

    sequenceInputArrays.forEach(seq => {
        // Stage 1: Encoding Selection
        const encoded = encoding(seq, tasksUpdated);

        // Stage 2: Alignment
        const aligned = alignment(encoded);
        
        // Stage 3: Layout
        const laid = layout(aligned, tasksUpdated, dataspec['connectionType']);
        
        // Add View Information
        const viewGroupElement = [];
        laid.forEach(val => {
            val['sequenceName'] = seq['sequenceName'];
            viewGroupElement.push(val);
        });

        viewGroups.push(viewGroupElement);
    });

    // Stage 4: Partition
    const partitioned = partition(viewGroups, tasksUpdated, dataspec['connectionType']);

    // Stage 5: Arrangement
    const arranged = arrangement(partitioned, { connectionType: dataspec['connectionType'] }, tasksUpdated);

    // Adding additional information to the spec
    arranged.forEach(val => {
        val['geneAnnotation'] = dataspec['geneAnnotation'];
        val['ideogramDisplayed'] = dataspec['ideogramDisplayed'];
        val['tasks'] = tasksUpdated.length > 0 ? tasksUpdated[0] : 'overview';
    });

    const recommendationSpecNonDuplicatesUpdated = checkDuplicates(Object.values(arranged));

    return recommendationSpecNonDuplicatesUpdated;
}
