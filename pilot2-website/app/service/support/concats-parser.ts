
export class ConcatsParser {

    static defaultDelimiter:string = "^|delim|^";

    static makeStringArray(concat: string, delimiter?: string): String[] {
        let delim = delimiter ? delimiter : this.defaultDelimiter;
        return concat == "" ? null : concat.split(delim);
    }

    static makeMapOfStringArrays (concat: string, delimiter?: string): Map<String, String[]> {
        let delim = delimiter ? delimiter : this.defaultDelimiter;

        if (concat == "") return null;

        let array = concat.split(delim) as String[];

        var map = new Map<String, String[]>();

        for (let item of array) {
            let split = item.split("@");

            if (split.length > 2) {
                let last = split.pop();
                while (split.length > 1) {
                    split[0] += "@" + split.pop();
                }
                split.push(last);
            }

            if (split.length == 2) {

                if (map.has(split[1])) {
                    map.get(split[1]).push(split[0]);
                }
                else {
                    map.set(split[1], [split[0]]);
                }
            }
        }
        return map;
    }
    static makeStringTupleArray (concat: string, delimiter?: string) : [String, String][] {
        let delim = delimiter ? delimiter : this.defaultDelimiter;
        let split = concat.split(delim);
        if (concat == "" || split.length < 2) return null;
        let result: [String, String][] = [];
        for (let i = 1; i < split.length; i+=2) {
            result.push([split[i-1],split[i]]);
        }
        return result;
    }

}