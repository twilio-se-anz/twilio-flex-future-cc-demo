import { ITask, Manager } from '@twilio/flex-ui';

export const replaceStringAttributes = (text: string, task: ITask): string => {
  return text.replace(/{{(task|worker)\.((\w|\.)+)}}/g, (match: string, part1: string, part2: string) => {
    // this runs for each match found

    let attributes;

    if (part1 === 'task') {
      attributes = task.attributes;
    } else if (part1 === 'worker') {
      attributes = Manager.getInstance().workerClient?.attributes;
    } else {
      return match;
    }

    return part2.split('.').reduce((accumulator: any, current, _index, array) => {
      if (!accumulator[current]) {
        // abort early by removing the rest of the array
        array.splice(1);
        return '';
      }
      return accumulator[current];
    }, attributes);
  });
};
