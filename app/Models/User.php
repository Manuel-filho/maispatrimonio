<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'phone',
        'birthdate',
        'gender',
        'net_worth',
        'max_net_worth',
        'preferred_currency_id',
    ];

    /**
     * Obtém a liquidez total (soma das contas).
     */
    public function getLiquidityAttribute()
    {
        return $this->accounts()->sum('balance');
    }

    /**
     * Obtém o valor total dos ativos imobilizados.
     */
    public function getAssetsValueAttribute()
    {
        return $this->assets()->sum('estimated_value');
    }

    /**
     * Obtém o património total (Liquidez + Ativos).
     */
    public function getTotalNetWorthAttribute()
    {
        return $this->liquidity + $this->assets_value;
    }

    /**
     * Obtém os ativos do utilizador.
     */
    public function assets()
    {
        return $this->hasMany(Asset::class);
    }

    /**
     * Obtém a moeda preferida do utilizador.
     */
    public function preferredCurrency()
    {
        return $this->belongsTo(Currency::class, 'preferred_currency_id');
    }

    /**
     * Obtém as moedas do utilizador.
     */
    public function currencies()
    {
        return $this->hasMany(Currency::class);
    }

    /**
     * Os atributos que devem ser ocultados na serialização.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Obtém os atributos que devem ser convertidos (cast).
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birthdate' => 'date',
            'net_worth' => 'decimal:2',
        ];
    }

    /**
     * Obtém o identificador que será armazenado na claim 'subject' do JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Retorna um array de chave-valor, contendo quaisquer claims personalizadas a serem adicionadas ao JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Obtém as contas do utilizador.
     */
    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Obtém as categorias do utilizador.
     */
    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
