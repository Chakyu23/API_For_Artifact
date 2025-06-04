//Use node index.js in the terminal for execute the script.
//Warning: Firefox does not fully support the editor. Please use a chromimum-based web browser such as Chrome, Brave or Edge.
//This script is a basic example of a player's movement. You can load other examples by clicking on "Load example".
import { URL_API} from '@/constants'

const character = "Chakyu23";

export async function movement(token: string) {

    const url = URL_API + '/my/' + character +'/action/move';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + token
        },
        body: '{"x":-1,"y":0}' //change the position here
    };

    try {
        const response = await fetch(url, options);
        const { data } = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}