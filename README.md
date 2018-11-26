# Automation Hackathon with Phoenix Contact

This Projects enables the PLC Next Controller to do Image processing and gives it AI capabilities, that can be transformed to an App to the PLCnext Store after launch.

## Install Python setup on PLCnext Control unit

```python
# set super user
su

# check for disc space
df -h

# install package manager
# change for x86
wget -O - http://ipkg.nslu2-linux.org/optware-ng/bootstrap/buildroot-armeabihf-bootstrap.sh | sh
# check if the date is correct (otherwise the ssl handshake goes bad)
date -R
# set date (if necessary)
date --set <yyyy-mm-dd>
date --set <hh:mm>
# add all relevant paths
export PATH=$PATH:/opt/bin:/opt/sbin:/opt/local/bin/

# install packages
ipkg install python3
alias python=/opt/bin/python3.7
# install necessary packages
ipkg install py3-pip
ipkg install gcc

# update pip
pip3 install --upgrade pip

pip3 install flask
pip3 install flask_sockets
pip3 install flask_cors
pip3 install requests
pip3 install Pillow

python server/server.py \
--user <BASIC AUTH USER> \
--pwd <BASIC AUTH PWD> \
--stream_id <STREAM ID> \
--dataset_id <DATASET ID>
--indexer <INDEXER ID>
```

## Development Frontend

Make sure you have NPM and yarn installed.
In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
