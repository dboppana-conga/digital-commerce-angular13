import * as _ from 'lodash';
import { memoizeAll } from 'lodash-decorators';

export class TreeUtils {
    static arrayToTree(data, options) {
        options = Object.assign(
            {
                parentProperty: 'parent_id',
                childrenProperty: 'children',
                customID: 'id',
                rootID: '0'
            },
            options
        );

        if (!Array.isArray(data)) {
            throw new TypeError('Expected an array but got an invalid argument');
        }

        const grouped = TreeUtils.groupByParents(data, options);
        return TreeUtils.createTree(
            grouped,
            grouped[options.rootID],
            options.customID,
            options.childrenProperty
        );
    }

    static createTree(array, rootNodes, customID, childrenProperty) {
        const tree = [];

        for (const rootNode in rootNodes) {
            const node = rootNodes[rootNode];
            const childNode = array[_.get(node, customID)];
            if (!node && !rootNodes.hasOwnProperty(rootNode)) {
                continue;
            }
            if (childNode) {
                _.set(node, childrenProperty, TreeUtils.createTree(
                    array,
                    childNode,
                    customID,
                    childrenProperty
                ));
            }
            tree.push(node);
        }
        return tree;
    }

    static groupByParents(array, options) {
        const arrayByID = _.keyBy(array, options.customID);

        return array.reduce(function (prev, item) {
            let parentID = _.get(item, options.parentProperty);
            if (!parentID || !arrayByID.hasOwnProperty(parentID)) {
                parentID = options.rootID;
            }

            if (parentID && prev.hasOwnProperty(parentID)) {
                prev[parentID].push(item);
                return prev;
            }

            prev[parentID] = [item];
            return prev;
        }, {});
    }
}
