<template id="login-form">
  <md-content>
    <md-card>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Mux - Login</div>
          <div class="md-subhead">Welcome!</div>
        </md-card-header-text>
        <md-card-media>
          <img src="@/assets/mstile-70x70.png" alt="Logo">
        </md-card-media>
      </md-card-header>

      <md-card-content>
        <md-field>
          <md-icon>account_circle</md-icon>
          <label>Username</label>
          <md-input></md-input>
        </md-field>
        <md-field>
          <md-icon>lock</md-icon>
          <label>Password</label>
          <md-input v-model="password" type="password"></md-input>
        </md-field>
      </md-card-content>

      <md-card-actions>
        <md-button class="md-raised md-primary">Login</md-button>
      </md-card-actions>
    </md-card>
  </md-content>

</template>

<script>
export default {
  name: 'LoginForm'
}
</script>
