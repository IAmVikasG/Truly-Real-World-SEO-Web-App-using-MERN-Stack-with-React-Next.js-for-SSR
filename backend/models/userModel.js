const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;

// Define the User schema
const userSchema = Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            unique: true,
            index: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        profile: {
            type: String,
            required: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String,
        about: {
            type: String
        },
        role: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        resetPasswordLink: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

// Virtual field for password
userSchema
    .virtual('password')
    .set(function (password)
    {
        // create a temporary variable called _password
        this._password = password;
        // generate salt
        this.salt = this.makeSalt();
        // encryptPassword
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function ()
    {
        return this._password;
    });

// Methods for the User schema
userSchema.methods = {
    // Authenticate method
    authenticate: function (plainText)
    {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    // Encrypt password method
    encryptPassword: function (password)
    {
        if (!password) return '';
        try
        {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err)
        {
            return '';
        }
    },

    // Generate salt method
    makeSalt: function ()
    {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
