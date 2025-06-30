<script setup lang="ts">
import { SignedOut, SignIn} from "@clerk/vue";


</script>
<template>
  <SignedOut>
    <section class="relative flex justify-center items-center">
      <SignIn oauthFlow="auto"/>
    </section>
  </SignedOut>
</template>