export class User {
    constructor({
        id = null,
        name,
        email,
        profileIcon = null,
        role = 'Developer',
        language = 'en'
    }) {
        this.id = id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
        this.name = name;
        this.email = email;
        this.profileIcon = profileIcon || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        this.role = role;
        this.language = language;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            profileIcon: this.profileIcon,
            role: this.role,
            language: this.language
        };
    }
}

export default User;

