export const UserService = new class {
  async find(id: string) {
    return { id, name: 'Bruce Wayne' };
  }
  async list() {
    return [await this.find('1')];
  }
}();
