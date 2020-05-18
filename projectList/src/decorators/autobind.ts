namespace App {
  export function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get(): any {
        return originalMethod.bind(this);
      }
    };
    return adjDescriptor;
  }
}