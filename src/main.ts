import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Bootstrap da aplicação Angular
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => {
    // Log de erros durante a inicialização da aplicação
    console.error('Erro ao inicializar a aplicação GUMP:', err);
  });
