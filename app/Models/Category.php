<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'description',
    ];

    /**
     * Obtém o utilizador proprietário da categoria.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtém as transações desta categoria.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
