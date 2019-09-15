1. Install Redis
```bash
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
```
2. Install Python 
```bash
brew install python
```
3. Install virtualenv
```bash
pip install virtualenv
```
4. Clone repo
```bash
git clone https://github.com/KappaThetaTau/tt-voting.git
```
5. Create virtual environment, activate it, and install python requirements
```bash
cd tt-voting
virtualenv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
6. Start the application
```bash
python app.py
```
7. **In another terminal**, start redis
```bash
redis-server
```
8. Confirm it works by navigating to http://localhost:5000/admin for admin page and http://localhost:5000 for voting. Click yes or no and see the votes change on http://localhost:5000/admin
9. **In another terminal**, expose the localhost remotely using localxpose. When you run this application for the first time you will be stopped because you are starting an app from an unidentified developer. Go to system preferences and open this app anyway. Then come back to your terminal and run the command again.
```bash
./loclx-darwin-amd64 tunnel http --to 127.0.0.1:5000
# You should see something like this
✓ Creating HTTP tunnel...

Tunneling http://4qhxgb4rxn0o.loclx.io --> 127.0.0.1:8080
Tunneling https://4qhxgb4rxn0o.loclx.io --> 127.0.0.1:8080
```
10. You should now have 3 terminals open. One for localxpose, app.py, and redis-server. Test the url by opening it in a browser. If it works, then simply share this URL to the brothers! Done!
