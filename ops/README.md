# Node creation

You might not want to run CAMB on your local machine, especially if you're running a lot of models. This playbook provisions a DigitalOcean droplet with CAMB installed, so you can SSH in and run whatever models you like. To use this playbook, note that you'll:

1. Need to have a digitalocean account and have generated an API key.
2. Need to set `ssh_key_ids` to the SSH key(s) you use (get the ID from the DigitalOcean API at `https://api.digitalocean.com/v2/account/keys`).

Then from this directory:

```
$ pip -r requirements.txt
$ export DO_API_TOKEN=yourtokengoeshere
$ ansible-playbook compute_node.yml --key-file "~/.ssh/my_ssh_key"
```

Now you can SSH into the created server, and binary CAMB will be in the path.

# Node destruction

After you're done with a session of generating data, destroy the node via:

```
$ ansible-playbook cleanup_node.yaml
```
