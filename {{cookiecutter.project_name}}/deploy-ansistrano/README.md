# README

1. Create virtualenv

    ```
    python3 -m venv venv && source venv/bin/activate
    ```

2. Install ansible: 

    ```
    pip install -r requirements.txt
    ```

3. Install ansible ansistrano:

    ```
    ansible-galaxy install -r requirements.yml
    ```

## Testing

1. Install vagrant
2. Start vagrant:

    ```
    vagrant up
    ```

3. Deploy:

    ```
    ansible-playbook deploy.yml -i hosts
    ```

4. Rollback: 

    ```
    ansible-playbook rollback.yml -i hosts
    ```


## Deploy

### Stage
- Deploy: `ansible-playbook deploy.yml -i hosts_stage`

### Prod
- Deploy: `ansible-playbook deploy.yml -i hosts_prod`
