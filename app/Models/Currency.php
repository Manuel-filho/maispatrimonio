<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'code',
        'symbol',
    ];

    /**
     * Obtém o utilizador proprietário da moeda.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtém as contas que utilizam esta moeda.
     */
    public function accounts()
    {
        return $this->hasMany(Account::class);
    }
}
