import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const testOpenAI = async () => {
    try {
        console.log("Testing OpenAI with key:", process.env.CHATGPT_API_KEY.slice(0, 15) + "...");
        const form = new FormData();
        form.append('prompt', 'A cute cat');
        const response = await axios.post("https://clipdrop-api.co/text-to-image/v1", form, {
            headers: {
                "x-api-key": process.env.CLIPDROP_API
            },
            responseType: 'arraybuffer'
        });
        console.log("Success! Data received. Length:", response.data.length);
        console.log("Success! Data received.");
    } catch (error) {
        if (error.response) {
            console.error("OpenAI Error:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testOpenAI();
