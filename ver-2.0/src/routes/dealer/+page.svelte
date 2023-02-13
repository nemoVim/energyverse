<script>
    let title, dealer, password;

    import { postReq } from '$lib/utils/requests';

    export async function submit() {
        try {
            const resMsg = await postReq(fetch, '/api/room', {
                title: title,
                dealer: dealer,
                password: password,
            });
            console.log(resMsg);
            location.href = `/room/${title}`;
        } catch (e) {
            console.error(e);
        }
    }
</script>

<h1>Dealer</h1>

<input type="text" bind:value={title} placeholder="방 이름을 입력하세요." />
<input type="text" bind:value={dealer} placeholder="딜러 이름을 입력하세요." />
<input type="password" bind:value={password} placeholder="암호를 입력하세요." />

<button on:click={submit}>확인</button>
