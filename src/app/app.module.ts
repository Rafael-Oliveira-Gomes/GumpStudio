import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatRippleModule } from '@angular/material/core';
// Material Design imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

// Componentes da aplicação
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { TatuadorComponent } from './components/tatuador/tatuador.component';
import { SessaoComponent } from './components/sessao/sessao.component';
import { NavegacaoComponent } from './components/navegacao/navegacao.component';

// Services
import { ClienteService } from './services/cliente.service';
import { TatuadorService } from './services/tatuador.service';
import { SessaoService } from './services/sessao.service';

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    TatuadorComponent,
    SessaoComponent,
    NavegacaoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Material Design Modules
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
    MatTabsModule,
    MatIconModule,
    MatRippleModule  
  ],
  providers: [
    ClienteService,
    TatuadorService,
    SessaoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
