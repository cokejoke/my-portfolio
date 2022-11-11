<script lang="ts">

    import Input from "../components/Input.svelte";
    import Button from "../components/Button.svelte";
    import Textarea from "../components/Textarea.svelte";
    import emailjs from '@emailjs/browser';
    import Loading from "../components/Loading.svelte";

    let message;
    let loading = false;

    let templateParams = {
        name: '',
        email: '',
        message: ''
    };

    function isValidEmail(email: string): boolean {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }

    function validateParams(): boolean {
        return isValidEmail(templateParams.email) && templateParams.name !== '' && message !== '';
    }

    function submit() {
        if (loading) {
            return;
        }

        if (!validateParams()) {
            alert("Please fill all fields correctly!");
            return;
        }

        loading = true;
        templateParams.message = message.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
        emailjs.send('service_bspbpq6', 'template_n8sc38c', templateParams, 'PiQJ1r4dJ988XUngb')
            .then(function (response) {
                loading = false;
                if (response.status === 200) {
                    alert('Successfully sent!');
                }
            }, function (err) {
                loading = false;
                console.log('FAILED...', err);
            });
    }
</script>

<div id="contact">
    <div id="box">
        <h1>Contact</h1>
        <Input bind:value={templateParams.name} placeholder="Name"/>
        <Input bind:value={templateParams.email} type="email" placeholder="E-Mail"/>
        <Textarea bind:value={message} placeholder="Message"/>
        <Button on:click={() => submit()} width="100%">
            {#if loading}
                <Loading/>
            {:else}
                Send
            {/if}
        </Button>
    </div>
</div>

<style>

    #contact {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 100%;
        height: 100vh;
    }

    #box {
        width: 100%;
        max-width: 550px;
    }

    h1 {
        transition: width 0.5s;
    }

    h1:after {
        transition: width 0.5s;
        content: '';
        margin: 50px auto 100px auto;
        display: block;
        height: 5px;
        width: 80px;
        background: var(--secondary-background);
    }

    h1:hover:after {
        width: 150px;
    }

    p {
        font-size: 25px;
        font-weight: lighter;
        padding: 10px 30px;
    }

</style>