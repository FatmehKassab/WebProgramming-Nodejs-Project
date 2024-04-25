class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async confirmlogin(email, password) {
        try {
            var user = await this.userRepository.checklogin(email, password);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async register(email, password, firstname, lastname, address, phonenumber) {
        try {
            var result = await this.userRepository.register(email, password, firstname, lastname, address, phonenumber);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async AddContact( name, email, feedback) {
        try {
            var result = await this.userRepository.AddContact( name, email, feedback);
            return result;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = UserService;
