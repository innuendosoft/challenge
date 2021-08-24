import app from './server';
import {connect} from './database';

async function main()
{
    app.listen(app.get('port'));
    await connect();
}

main();