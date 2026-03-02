<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->timestamp('cancelled_at')->nullable()->after('date');
            $table->unsignedBigInteger('parent_transaction_id')->nullable()->after('cancelled_at');
            
            $table->foreign('parent_transaction_id')
                  ->references('id')
                  ->on('transactions')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['parent_transaction_id']);
            $table->dropColumn(['cancelled_at', 'parent_transaction_id']);
        });
    }
};
