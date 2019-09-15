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
7. In another terminal, start redis
```bash
redis-server
```
8. Navigate to http://localhost:5000/admin for admin page and http://localhost:5000 for voting
