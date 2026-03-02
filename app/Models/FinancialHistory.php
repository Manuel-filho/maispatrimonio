<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialHistory extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'liquidity',
        'assets_value',
        'net_worth',
    ];

    /**
     * Obtém o utilizador dono deste registo histórico.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
