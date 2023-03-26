const dotenv = require('dotenv').config();

const confirmEmailSchema = (username, url) => {
    return `
        <article> 
            <h1 style="margin: 0;"> Welcome to ${process.env.APP_NAME}, <span style="font-weight: bold; color: rgba(255, 0, 128, 0.76);"> ${username} </span> ! </h1>
            <h3> In order to continue using foodz, please confirm your account bellow. </h3>
            <a href="${url}"> <button style="cursor: pointer; border-radius: 5px; border: 1px solid gray; padding: 2% 10% 2% 10%; background: transparent; font-size: 12vh; font-weight: bold; color: rgba(255, 0, 128, 0.76);" > Confirm </button> </a> 
        </article>
    `
}

const changePasswordHTMLSchema = (username, url) => {
    return `
        <article> 
            <h1 style="margin: 0;"> Greetings <span style="font-weight: bold; color: rgba(255, 0, 128, 0.76);"> ${username} </span> ! </h1>
            <h3> In order to change your password please press confirm down bellow. </h3>
            <a href="${url}"> <button style="cursor: pointer; border-radius: 5px; border: 1px solid gray; padding: 2% 10% 2% 10%; background: transparent; font-size: 12vh; font-weight: bold; color: rgba(255, 0, 128, 0.76);" > Confirm </button> </a> 
        </article>
    `
}

const resetPasswordHTMLSchema = (url) => {
    return `
        <article> 
            <h1 style="margin: 0;"> Greetings ! </h1>
            <h3> Forgot your password ? Don't worry ! In order to change it please press confirm down bellow. </h3>
            <a href="${url}"> <button style="cursor: pointer; border-radius: 5px; border: 1px solid gray; padding: 2% 10% 2% 10%; background: transparent; font-size: 12vh; font-weight: bold; color: rgba(255, 0, 128, 0.76);" > Confirm </button> </a> 
        </article>
    `
}

module.exports = { confirmEmailSchema, changePasswordHTMLSchema, resetPasswordHTMLSchema };