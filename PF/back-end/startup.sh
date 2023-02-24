chmod u+x startup.sh
chmod u+x run.sh
chmod u+x manage.py
python3 -m virtualenv -p `which python3` venv
source venv/bin/activate
pip install -r requirements.txt
./manage.py makemigrations
./manage.py migrate
