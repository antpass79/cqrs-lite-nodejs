export class ClassNameExtractor {
    static getClassName(object: any): string {
        return Object.prototype.toString.call(object);
    }
}