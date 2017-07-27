```
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

ansible-galaxy install -r requirements.yml
ansible-playbook deploy.yml -i hosts
```
