import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Dropdown } from 'flowbite';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}
// يتأكد إن password و confirmPassword متطابقين
const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { mismatch: true } : null;
};

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private fb = inject(FormBuilder);

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  // ===== Flowbite Dropdown =====
  private countryBtn = viewChild.required<ElementRef<HTMLButtonElement>>('countryBtn');
  private countryMenu = viewChild.required<ElementRef<HTMLElement>>('countryMenu');
  private dropdown?: Dropdown;

  countries: Country[] = [
    { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
    { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
    { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
    { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
    { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
    { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
    { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
    { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
    { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾' },
    { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
    { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
    { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
    { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
    { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  ];

  selectedCountry = signal<Country>(this.countries[0]); // مصر

  constructor() {
    afterNextRender(() => {
      this.dropdown = new Dropdown(
        this.countryMenu().nativeElement,
        this.countryBtn().nativeElement,
        {
          placement: 'bottom-start',
          offsetDistance: 6,
        }
      );
    });
  }

  selectCountry(country: Country) {
    this.selectedCountry.set(country);
    this.dropdown?.hide();
  }

  ngOnDestroy() {
    this.dropdown?.destroy();
  }

  // ===== الجندر =====
  genders = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
  ];

  form = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      gender: ['female', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  get fullName() { return this.form.controls.fullName; }
  get email() { return this.form.controls.email; }
  get phone() { return this.form.controls.phone; }
  get gender() { return this.form.controls.gender; }
  get password() { return this.form.controls.password; }
  get confirmPassword() { return this.form.controls.confirmPassword; }

  // يظهر خطأ التطابق بس بعد ما المستخدم يلمس الحقل
  get showMismatch() {
    return this.form.hasError('mismatch') && this.confirmPassword.touched;
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  setGender(value: string) {
    this.gender.setValue(value);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { confirmPassword, ...values } = this.form.getRawValue();
    const payload = {
      ...values,
      phone: this.selectedCountry().dialCode + values.phone,
    };
    console.log(payload); // confirmPassword مش بيتبعت للـ API
  }
}
