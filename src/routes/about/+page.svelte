<script>
    export let data;
</script>

<h1>About 페이지임</h1>

<form methos="post" action="/login">
    <input type="text" name="email" placeholder="이메일" />
    <input type="text" name="password" placeholder="비번" />
    <button type="submit">로그인</button>
</form>

<span>{data.title}</span>

<ul>
    {#each Object.entries(data) as [name, value]}
        <li>{name} : {value}</li>
    {/each}
</ul>
